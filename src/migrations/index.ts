import * as migration_20261111_120000_pages_blocks from './20261111_120000_pages_blocks'

export const migrations = [
  {
    up: migration_20261111_120000_pages_blocks.up,
    down: migration_20261111_120000_pages_blocks.down,
    name: '20261111_120000_pages_blocks',
  },
]
