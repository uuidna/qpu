// Fundamental Physics - Exploring quantum mechanics at Planck scale and beyond
export interface FundamentalConstant {
  name: string
  symbol: string
  value: number
  unit: string
  scale: string
}

export interface UniverseScale {
  scale: string
  distance: string
  timeScale: string
  energyScale: string
  phenomena: string[]
}

export class FundamentalPhysics {
  private constants: FundamentalConstant[] = [
    {
      name: 'Planck Length',
      symbol: 'lₚ',
      value: 1.616e-35,
      unit: 'meters',
      scale: 'quantum spacetime',
    },
    {
      name: 'Planck Time',
      symbol: 'tₚ',
      value: 5.391e-44,
      unit: 'seconds',
      scale: 'quantum gravity',
    },
    {
      name: 'Planck Mass',
      symbol: 'mₚ',
      value: 2.176e-8,
      unit: 'kilograms',
      scale: 'quantum gravity',
    },
    {
      name: 'Planck Energy',
      symbol: 'Eₚ',
      value: 1.956e9,
      unit: 'joules',
      scale: 'grand unification',
    },
    {
      name: 'Planck Temperature',
      symbol: 'Tₚ',
      value: 1.417e32,
      unit: 'kelvin',
      scale: 'big bang singularity',
    },
  ]

  private scales: UniverseScale[] = [
    {
      scale: 'Subatomic (< 10⁻¹⁵ m)',
      distance: 'Quarks, leptons',
      timeScale: '10⁻²⁴ s',
      energyScale: 'TeV - PeV',
      phenomena: ['Weak interaction', 'Strong force', 'Electromagnetism'],
    },
    {
      scale: 'Atomic (10⁻¹⁰ m)',
      distance: 'Electron shells',
      timeScale: '10⁻¹⁶ s',
      energyScale: 'eV - keV',
      phenomena: ['Quantum mechanics', 'Chemical bonds', 'Spectroscopy'],
    },
    {
      scale: 'Molecular (10⁻⁹ m)',
      distance: 'Molecular structures',
      timeScale: '10⁻¹² s',
      energyScale: 'meV - eV',
      phenomena: ['Biochemistry', 'Drug interaction', 'Protein folding'],
    },
    {
      scale: 'Macroscopic (10⁻³ - 1 m)',
      distance: 'Everyday objects',
      timeScale: '10⁻³ - 1 s',
      energyScale: 'J',
      phenomena: ['Classical mechanics', 'Thermodynamics', 'Optics'],
    },
    {
      scale: 'Cosmological (> 10²⁶ m)',
      distance: 'Galaxy clusters',
      timeScale: '10⁹ - 10¹⁷ s',
      energyScale: 'erg',
      phenomena: ['General relativity', 'Dark matter', 'Cosmic expansion'],
    },
  ]

  getConstants(): FundamentalConstant[] {
    return this.constants
  }

  getScales(): UniverseScale[] {
    return this.scales
  }

  calculateCrossoverScale(scale1: string, scale2: string): {
    distance: number
    timeScale: number
    regime: string
  } {
    const quantumClassicalCrossover = 1e-9

    return {
      distance: quantumClassicalCrossover,
      timeScale: quantumClassicalCrossover / 3e8,
      regime: 'Mesoscopic quantum regime',
    }
  }

  exploreQuantumInformation() {
    return {
      entropy: 'S = k_B ln(Ω) - measure of quantum information',
      entanglement: 'ξ = max correlation strength in quantum systems',
      bellInequality: '⟨AB⟩ + ⟨BC⟩ + ⟨CA⟩ ≤ 2 + √2 (violated in quantum)',
      nonlocality: 'Quantum correlations stronger than classically possible',
      contextuality: 'Quantum measurements reveal contextual properties',
    }
  }

  exploreBeyondQuantum() {
    return {
      stringTheory: {
        description: 'Fundamental strings at Planck scale',
        dimensions: 11,
        vibrationModes: 'represent all particles and forces',
        status: 'speculative',
      },
      loopQuantumGravity: {
        description: 'Spacetime quantization without strings',
        graininess: 'Planck length',
        discreteness: 'Fundamental nature',
        status: 'research',
      },
      causalSetTheory: {
        description: 'Spacetime as discrete causal events',
        fundamentalness: 'Causality is primitive',
        continuity: 'Emerges at macroscale',
        status: 'developing',
      },
      holographicPrinciple: {
        description: 'Bulk physics encoded on boundary',
        dimensions: 'n-dim bulk = (n-1)-dim boundary',
        information: '1 bit per Planck area',
        status: 'conjectured',
      },
    }
  }

  getStats() {
    return {
      fundamentalConstantCount: this.constants.length,
      scalesOfNature: this.scales.length,
      orderOfMagnitude: {
        largest: '10²⁶ meters (observable universe)',
        smallest: '10⁻³⁵ meters (Planck length)',
        ratio: '10⁶¹,',
      },
      quantumRegime: 'All scales below ~10⁻⁶ meters',
      classicalRegime: 'All scales above ~10⁻⁶ meters',
    }
  }
}

export const physics = new FundamentalPhysics()
