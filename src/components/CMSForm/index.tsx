'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type FormField = { blockType: string; name: string; label?: string | null; required?: boolean | null; width?: number | null }

/** A form-builder form, submitted to Payload's form-submissions collection. */
export function CMSForm({ formId, fields, submitLabel, confirmation }: { formId: string; fields: FormField[]; submitLabel: string; confirmation: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    const data = new FormData(event.currentTarget)
    const submissionData = fields.map((f) => ({ field: f.name, value: String(data.get(f.name) ?? '') }))
    const res = await fetch('/api/form-submissions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ form: formId, submissionData }) })
    if (res.ok) return setState('sent')
    setError(((await res.json().catch(() => ({}))) as { errors?: { message?: string }[] }).errors?.[0]?.message ?? `HTTP ${res.status}`)
    setState('error')
  }

  if (state === 'sent') return <p className="rounded-lg border bg-muted/40 p-4 text-sm">{confirmation}</p>

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={`grid gap-1.5 ${f.width === 50 ? '' : 'sm:col-span-2'}`}>
          <Label htmlFor={f.name}>{f.label ?? f.name}{f.required ? ' *' : ''}</Label>
          {f.blockType === 'textarea' ? (
            <Textarea id={f.name} name={f.name} required={Boolean(f.required)} rows={4} />
          ) : (
            <Input id={f.name} name={f.name} type={f.blockType === 'email' ? 'email' : 'text'} required={Boolean(f.required)} />
          )}
        </div>
      ))}
      <div className="flex items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : submitLabel}</Button>
        {state === 'error' ? <span className="text-sm text-destructive">{error}</span> : null}
      </div>
    </form>
  )
}
