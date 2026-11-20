import * as migration_20261120_163138_baseline from './20261120_163138_baseline';

export const migrations = [
  {
    up: migration_20261120_163138_baseline.up,
    down: migration_20261120_163138_baseline.down,
    name: '20261120_163138_baseline'
  },
];
