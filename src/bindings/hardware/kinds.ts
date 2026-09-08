import { OPS_GET, spec } from '../types.js'
import { QPU_POINTS } from '../../hologram.js'

const p = 'hardware' as const

const point = (name: string) =>
  spec(p, name.toLowerCase(), name, name, OPS_GET)

/** BindingPoint pentagram + peripherals. Kind `qpu` is named and never binds. */
export const HARDWARE_BINDINGS = Object.freeze([
  ...QPU_POINTS.map(point),
  spec(p, 'qpu', 'QPU', 'QPU', OPS_GET),
  spec(p, 'nic', 'NIC', 'nic', OPS_GET),
  spec(p, 'tpu', 'TPU', 'tpu', OPS_GET),
  spec(p, 'npu', 'NPU', 'npu', OPS_GET),
  spec(p, 'fpga', 'FPGA', 'fpga', OPS_GET),
  spec(p, 'dpu', 'DPU', 'dpu', OPS_GET),
  spec(p, 'usb', 'USB', 'usb', OPS_GET),
  spec(p, 'nvme', 'NVME', 'nvme', OPS_GET),
  spec(p, 'pcie', 'PCIE', 'pcie', OPS_GET),
  spec(p, 'i2c', 'I2C', 'i2c', OPS_GET),
  spec(p, 'spi', 'SPI', 'spi', OPS_GET),
  spec(p, 'uart', 'UART', 'uart', OPS_GET),
  spec(p, 'gpio', 'GPIO', 'gpio', OPS_GET),
  spec(p, 'wifi', 'WIFI', 'wifi', OPS_GET),
  spec(p, 'audio', 'AUDIO', 'audio', OPS_GET),
  spec(p, 'display', 'DISPLAY', 'display', OPS_GET),
  spec(p, 'camera', 'CAMERA', 'camera', OPS_GET),
  spec(p, 'tpm', 'TPM', 'tpm', OPS_GET),
  spec(p, 'rtc', 'RTC', 'rtc', OPS_GET),
])
