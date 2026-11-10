import * as migration_20261110_064919_initial from './20261110_064919_initial';
import * as migration_20261110_085254_quantum_programs from './20261110_085254_quantum_programs';

export const migrations = [
  {
    up: migration_20261110_064919_initial.up,
    down: migration_20261110_064919_initial.down,
    name: '20261110_064919_initial',
  },
  {
    up: migration_20261110_085254_quantum_programs.up,
    down: migration_20261110_085254_quantum_programs.down,
    name: '20261110_085254_quantum_programs'
  },
];
