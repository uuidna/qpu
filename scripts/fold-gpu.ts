// fold-gpu — fill the VECTOR SEAT and check it against the reference. Runs the unit's own fold (FNV-1a 64) over N
// independent strings, one per GPU invocation, and compares every result bit for bit with the CPU. WGSL has no 64-bit
// integer, so the multiply is emulated in 32-bit halves. Needs a runtime that exposes WebGPU:
//     deno run --allow-all --unstable-webgpu scripts/fold-gpu.ts [N]
// Measured 2026-09-13, Apple M1 Max, 32 GPU cores: 70905 folds exact, gpu 50.3 ms against cpu 116.9 ms; 300000 folds
// exact, 75.0 ms against 470.5 ms. Past the device's 128 MiB storage binding the dispatch is REFUSED and the output
// buffer stays zero — and a ratio computed against those zeros read 67x. That is why nothing here is reported without
// the comparison: an unchecked seat is not a fast answer, it is no answer.
// The unit's own fold (FNV-1a 64) computed on the GPU, one independent string per invocation, and compared
// BIT FOR BIT against the CPU reference. WGSL has no u64, so the multiply is emulated in 32-bit halves.
// THE REFERENCE IS THE UNIT'S OWN FOLD, imported from the build — a re-implementation here could drift and then
// this instrument would compare two guesses instead of checking an occupant against the reference.
import { qpuFoldOf as cpuFold } from '../dist/quantum/processing/unit/index.js'
const N = Number(Deno.args[0] ?? 70905)
const strings = Array.from({ length: N }, (_, i) => `theorem_${i}|the fold is the identity and the identity is the fold|${i * 7919}`)
const bytes: number[] = []; const offs: number[] = []
for (const s of strings) { offs.push(bytes.length, s.length); for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i)) }

const tSetup = performance.now()
const adapter = await navigator.gpu.requestAdapter(); const device = await adapter!.requestDevice()
const code = `
struct Off { start: u32, len: u32 };
@group(0) @binding(0) var<storage, read> chars: array<u32>;
@group(0) @binding(1) var<storage, read> offs: array<Off>;
@group(0) @binding(2) var<storage, read_write> out: array<vec2<u32>>;
fn mul32(a: u32, b: u32) -> vec2<u32> {
  let a0 = a & 0xffffu; let a1 = a >> 16u; let b0 = b & 0xffffu; let b1 = b >> 16u;
  let p00 = a0 * b0; let p01 = a0 * b1; let p10 = a1 * b0; let p11 = a1 * b1;
  let mid = p01 + p10; let midCarry = select(0u, 1u, mid < p01);
  let lo = p00 + (mid << 16u); let loCarry = select(0u, 1u, lo < p00);
  let hi = p11 + (mid >> 16u) + (midCarry << 16u) + loCarry;
  return vec2<u32>(lo, hi);
}
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let i = gid.x; if (i >= arrayLength(&offs)) { return; }
  let o = offs[i];
  var h = vec2<u32>(0x84222325u, 0xcbf29ce4u);
  for (var k = 0u; k < o.len; k = k + 1u) {
    h.x = h.x ^ chars[o.start + k];
    let low = mul32(h.x, 0x1b3u);
    let cross = h.x * 0x100u + h.y * 0x1b3u;
    h = vec2<u32>(low.x, low.y + cross);
  }
  out[i] = h;
}`
const buf = (data: Uint32Array, usage: number) => {
  const b = device.createBuffer({ size: data.byteLength, usage, mappedAtCreation: true })
  new Uint32Array(b.getMappedRange()).set(data); b.unmap(); return b
}
const S = GPUBufferUsage.STORAGE, C = GPUBufferUsage.COPY_SRC, D = GPUBufferUsage.COPY_DST
const lim = device.limits.maxStorageBufferBindingSize
const charBytes = bytes.length * 4, offBytes = offs.length * 4, outBytes = N * 8
console.log(`chars ${(charBytes/1048576).toFixed(1)} MiB | offs ${(offBytes/1048576).toFixed(1)} MiB | out ${(outBytes/1048576).toFixed(1)} MiB | device limit ${(lim/1048576).toFixed(0)} MiB per binding`)
for (const [name, size] of [['chars', charBytes], ['offs', offBytes], ['out', outBytes]] as const)
  if (size > lim) console.log(`OVER THE LIMIT: ${name} asks ${(size/1048576).toFixed(1)} MiB of a ${(lim/1048576).toFixed(0)} MiB binding`)
device.addEventListener('uncapturederror', (e) => console.log('UNCAPTURED:', String((e as unknown as { error: unknown }).error).slice(0, 200)))
device.pushErrorScope('validation')
const charsB = buf(new Uint32Array(bytes), S), offsB = buf(new Uint32Array(offs), S)
const outB = device.createBuffer({ size: N * 8, usage: S | C })
const read = device.createBuffer({ size: N * 8, usage: D | GPUBufferUsage.MAP_READ })
const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module: device.createShaderModule({ code }), entryPoint: 'main' } })
const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
  { binding: 0, resource: { buffer: charsB } }, { binding: 1, resource: { buffer: offsB } }, { binding: 2, resource: { buffer: outB } }] })
const setupMs = performance.now() - tSetup
const t0 = performance.now()
const enc = device.createCommandEncoder(); const pass = enc.beginComputePass()
pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.dispatchWorkgroups(Math.ceil(N / 64)); pass.end()
enc.copyBufferToBuffer(outB, 0, read, 0, N * 8); device.queue.submit([enc.finish()])
const err = await device.popErrorScope()
if (err) console.log('VALIDATION:', String(err.message).slice(0, 240))
await read.mapAsync(GPUMapMode.READ)
const got = new Uint32Array(read.getMappedRange().slice(0))
const gpuMs = performance.now() - t0
const t1 = performance.now(); const want = strings.map(cpuFold); const cpuMs = performance.now() - t1
let bad = 0, first = ''
for (let i = 0; i < N; i++) {
  const hex = (BigInt(got[i * 2 + 1]) * 4294967296n + BigInt(got[i * 2])).toString(16).padStart(16, '0')
  if (hex !== want[i]) { if (!bad) first = `#${i} gpu ${hex} cpu ${want[i]}`; bad++ }
}
console.log(`folds ${N} | exact ${N - bad} | mismatched ${bad}${first ? ' | first ' + first : ''}`)
console.log(`setup ${setupMs.toFixed(1)} ms (adapter, device, buffers, pipeline) | gpu ${gpuMs.toFixed(1)} ms (submit to readback) | cpu ${cpuMs.toFixed(1)} ms | ratio ${(cpuMs/gpuMs).toFixed(2)}x`)
