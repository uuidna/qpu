import { OPS_GET, spec } from '../types.js'

const p = 'arch' as const
const a = (kind: string) => spec(p, kind, `ARCH_${kind.toUpperCase()}`, kind, OPS_GET)

/** Alpine's eight official ISAs, plus developer compile targets and GPU ISAs. Each is a driver. */
export const ARCH_BINDINGS = Object.freeze([
  a('x86_64'),
  a('x86'),
  a('aarch64'),
  a('armhf'),
  a('armv7'),
  a('ppc64le'),
  a('s390x'),
  a('riscv64'),
  a('loongarch64'),
  a('mips64'),
  a('wasm32'),
  a('wasm64'),
  a('cuda'),
  a('metal'),
  a('vulkan'),
  a('webgpu'),
  a('rocm'),
  a('oneapi'),
  a('opencl'),
  a('spirv'),
  a('ptx'),
  a('amdgcn'),
])
