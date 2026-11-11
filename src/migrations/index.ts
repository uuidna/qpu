import * as migration_20261111_120000_pages_blocks from './20261111_120000_pages_blocks'
import * as migration_20261111_125100_ecommerce_currencies from './20261111_125100_ecommerce_currencies'

export const migrations = [
  {
    up: migration_20261111_120000_pages_blocks.up,
    down: migration_20261111_120000_pages_blocks.down,
    name: '20261111_120000_pages_blocks',
  },
  {
    up: migration_20261111_125100_ecommerce_currencies.up,
    down: migration_20261111_125100_ecommerce_currencies.down,
    name: '20261111_125100_ecommerce_currencies',
  },
]
