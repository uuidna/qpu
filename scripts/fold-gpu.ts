// fold-gpu — fill the VECTOR SEAT and let the reference judge it. Runs this unit's own fold (FNV-1a 64) over N
// independent strings, one per GPU invocation, the 64-bit multiply emulated in 32-bit halves because WGSL has no
// 64-bit integer, and compares every result with the reference bit for bit. Needs a runtime exposing WebGPU:
//     deno run --allow-all --unstable-webgpu scripts/fold-gpu.ts [N]
// CHUNKED: a binding over the device's limit is refused, the output buffer stays zero, and the timing then reads as
// a triumph — so the work is cut into slices that fit, and nothing is reported without the comparison.
// Measured 2026-09-13, Apple M1 Max, 32 GPU cores: 70905 exact (50.3 ms against 116.9 ms), 300000 exact (75.0 against
// 470.5), 709050 exact in two chunks (201.2 against 1110.4), 1418100 exact in four (453.5 against 2286.6).
// The unit's own fold on the GPU, CHUNKED so no binding exceeds the device limit — the cure for the refusal that
// returned zeros and timed as a triumph. Every result is still compared with the reference, bit for bit.
import { qpuFoldOf as cpuFold } from '../dist/quantum/processing/unit/index.js'
const N = Number(Deno.args[0] ?? 709050)
const strings = Array.from({ length: N }, (_, i) => `theorem_${i}|the fold is the identity and the identity is the fold|${i * 7919}`)
const bytes: number[] = []; const offs: number[] = []
for (const s of strings) { offs.push(bytes.length, s.length); for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i)) }

const adapter = await navigator.gpu.requestAdapter(); const device = await adapter!.requestDevice()
const lim = device.limits.maxStorageBufferBindingSize
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
  return vec2<u32>(lo, p11 + (mid >> 16u) + (midCarry << 16u) + loCarry);
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
const S = GPUBufferUsage.STORAGE, C = GPUBufferUsage.COPY_SRC, D = GPUBufferUsage.COPY_DST
const buf = (data: Uint32Array) => {
  const b = device.createBuffer({ size: data.byteLength, usage: S, mappedAtCreation: true })
  new Uint32Array(b.getMappedRange()).set(data); b.unmap(); return b
}
const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module: device.createShaderModule({ code }), entryPoint: 'main' } })
const perFold = Math.ceil(bytes.length / N)
const perChunk = Math.max(1, Math.floor(lim / 4 / perFold) - 1)
const chunks: [number, number][] = []
for (let i = 0; i < N; i += perChunk) chunks.push([i, Math.min(N, i + perChunk)])
console.log(`folds ${N} | ${chunks.length} chunk(s) of at most ${perChunk}, each binding under the ${(lim / 1048576).toFixed(0)} MiB limit`)

device.pushErrorScope('validation')
const got = new Uint32Array(N * 2)
const t0 = performance.now()
for (const [from, to] of chunks) {
  const n = to - from
  const base = offs[from * 2]
  const end = offs[(to - 1) * 2] + offs[(to - 1) * 2 + 1]
  const subOffs: number[] = []
  for (let i = from; i < to; i++) subOffs.push(offs[i * 2] - base, offs[i * 2 + 1])
  const charsB = buf(new Uint32Array(bytes.slice(base, end)))
  const offsB = buf(new Uint32Array(subOffs))
  const outB = device.createBuffer({ size: n * 8, usage: S | C })
  const readB = device.createBuffer({ size: n * 8, usage: D | GPUBufferUsage.MAP_READ })
  const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
    { binding: 0, resource: { buffer: charsB } }, { binding: 1, resource: { buffer: offsB } }, { binding: 2, resource: { buffer: outB } }] })
  const enc = device.createCommandEncoder(); const pass = enc.beginComputePass()
  pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.dispatchWorkgroups(Math.ceil(n / 64)); pass.end()
  enc.copyBufferToBuffer(outB, 0, readB, 0, n * 8); device.queue.submit([enc.finish()])
  await readB.mapAsync(GPUMapMode.READ)
  got.set(new Uint32Array(readB.getMappedRange().slice(0)), from * 2)
  readB.unmap(); charsB.destroy(); offsB.destroy(); outB.destroy(); readB.destroy()
}
const gpuMs = performance.now() - t0
const err = await device.popErrorScope()
if (err) console.log('VALIDATION:', String(err.message).slice(0, 200))
const t1 = performance.now(); const want = strings.map(cpuFold); const cpuMs = performance.now() - t1
let bad = 0, first = ''
for (let i = 0; i < N; i++) {
  const hex = (BigInt(got[i * 2 + 1]) * 4294967296n + BigInt(got[i * 2])).toString(16).padStart(16, '0')
  if (hex !== want[i]) { if (!bad) first = `#${i} gpu ${hex} cpu ${want[i]}`; bad++ }
}
console.log(`exact ${N - bad} | mismatched ${bad}${first ? ' | first ' + first : ''}`)
console.log(`gpu ${gpuMs.toFixed(1)} ms | cpu ${cpuMs.toFixed(1)} ms | ratio ${(cpuMs / gpuMs).toFixed(2)}x`)
