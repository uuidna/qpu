import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as lib from './index.js'

const HOLDS = [
  'qpuChipHolds',
  'qpuFastenHolds',
  'qpuExperienceHolds',
  'qpuVersionMaskHolds',
  'qpuCaptainOrdersHolds',
  'qpuOgHolds',
  'qpuFractalHolds',
  'qpuCompareHolds',
  'qpuPackagesHolds',
  'qpuLiveHolds',
  'qpuSolidsHolds',
  'qpuCombinationsHolds',
  'qpuMorphHolds',
  'qpuFuseHolds',
  'qpuSearchHolds',
  'qpuStandingHolds',
  'qpuQuantumHolds',
  'qpuLicenceHolds',
  'qpuMessengerHolds',
  'qpuChatHolds',
  'qpuTrainHolds',
  'qpuConfigHolds',
  'qpuFirmwareHolds',
  'qpuPayloadHolds',
  'qpuHandleMaskHolds',
  'qpuGatewaysHolds',
] as const

test('package door Holds', () => {
  for (const name of HOLDS) {
    const fn = (lib as Record<string, unknown>)[name]
    assert.equal(typeof fn, 'function', name)
    assert.equal((fn as () => boolean)(), true, name)
  }
})

test('hexbit and handle widths are the quantum computer', () => {
  assert.equal(lib.HEXBIT_BITS, 4)
  assert.equal(lib.HEXBIT_STATES, 16)
  assert.equal(lib.HANDLE_HEXBITS, 8)
  assert.equal(lib.HANDLE_BITS, 32)
  assert.equal(lib.HANDLE_BITS, lib.HANDLE_HEXBITS * lib.HEXBIT_BITS)
  assert.equal(lib.qpuHandleMaskOf(0), 0)
  assert.equal(lib.qpuHandleMaskOf(lib.HANDLE_BITS), lib.qpuTwoNOf(lib.HANDLE_BITS) - 1)
  assert.equal(lib.qpuGatewaysOf().length, lib.VE_FACES)
  assert.equal(lib.VE_FACES, lib.HANDLE_HEXBITS + lib.HEXBIT_BITS + lib.COINS)
  assert.equal(lib.qpuIntegerOfHexbits(lib.qpuHexbitDigitsOf(32)), 32)
  assert.equal(lib.qpuTwoNOf(lib.HEXBIT_BITS), lib.HEXBIT_STATES)
  assert.equal('qpuLicenceRequireOf' in lib, false)
})
