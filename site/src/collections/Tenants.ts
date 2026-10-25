// The tenants: the collection the multi-tenant plugin requires, in the plugin's own shape — a name and the host that names the
// tenant (qpu.uuidna.com → uuidna, qpu.psg.bg → psg), as the Worker's TENANTS map; nothing custom beyond what the plugin asks.
import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'domain', type: 'text', required: true, unique: true, admin: { description: 'the host that names the tenant; the Worker maps it to the docket' } },
  ],
}
