import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formOf, plainOf, productsOf } from '../_lib/qpu'
import { LicenseForm, type FormField } from './license-form'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'License and billing',
  description: 'QPU is CC BY-NC-ND 4.0: reads are free and non-commercial use is open. Commercial use and storage writes are licensed.',
  alternates: { canonical: '/license' },
}

const FORM = 'Commercial license request'

export default async function License() {
  const [products, form] = await Promise.all([productsOf(), formOf(FORM)])
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">License and billing</h1>
        <p className="max-w-2xl text-muted-foreground">
          @uuidna/qpu is licensed CC BY-NC-ND 4.0. Reading qpu.uuidna.com and its MCP is free; non-commercial use with attribution is open.
          What is billed is commercial use and the right to write to the QPU document store.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">{p.priceInUSDEnabled && p.priceInUSD ? `$${(p.priceInUSD / 100).toFixed(2)}` : 'priced on request'}</Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      {form ? (
        <section className="max-w-2xl space-y-4">
          <h2 className="text-xl font-semibold">{form.title}</h2>
          <LicenseForm
            formId={form.id}
            fields={(form.fields ?? []) as unknown as FormField[]}
            submitLabel={form.submitButtonLabel ?? 'Send'}
            confirmation={plainOf(form.confirmationMessage) || 'Thank you.'}
          />
        </section>
      ) : null}
    </div>
  )
}
