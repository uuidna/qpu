import * as migration_20261120_163138_baseline from './20261120_163138_baseline';
import * as migration_20261121_073342_payload_beta11 from './20261121_073342_payload_beta11';

export const migrations = [
  {
    up: migration_20261120_163138_baseline.up,
    down: migration_20261120_163138_baseline.down,
    name: '20261120_163138_baseline',
  },
  {
    up: migration_20261121_073342_payload_beta11.up,
    down: migration_20261121_073342_payload_beta11.down,
    name: '20261121_073342_payload_beta11'
  },
];
