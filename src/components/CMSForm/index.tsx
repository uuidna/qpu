'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export type FormField = {
  blockType: string
  name?: string
  label?: string | null
  required?: boolean | null
  width?: number | null
  defaultValue?: string | number | boolean | null
  placeholder?: string | null
  options?: { label: string; value: string; id?: string | null }[] | null
  message?: unknown
}

const plain = (rich: unknown): string => {
  const walk = (n: unknown): string =>
    !n || typeof n !== 'object' ? '' : 'text' in n && typeof (n as { text: unknown }).text === 'string' ? (n as { text: string }).text : ((n as { children?: unknown[] }).children ?? []).map(walk).join(' ')
  return walk((rich as { root?: unknown } | undefined)?.root ?? rich).trim()
}

/** A form-builder form, submitted to Payload's form-submissions collection. */
export function CMSForm({ formId, fields, submitLabel, confirmation }: { formId: string; fields: FormField[]; submitLabel: string; confirmation: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    const data = new FormData(event.currentTarget)
    const submissionData = fields.filter((f) => f.name && f.blockType !== 'message').map((f) => ({ field: f.name, value: String(data.get(f.name!) ?? '') }))
    const res = await fetch('/api/form-submissions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ form: formId, submissionData }) })
    if (res.ok) return setState('sent')
    setError(((await res.json().catch(() => ({}))) as { errors?: { message?: string }[] }).errors?.[0]?.message ?? `HTTP ${res.status}`)
    setState('error')
  }

  if (state === 'sent') return <p className="rounded-lg border bg-muted/40 p-4 text-sm">{confirmation}</p>

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f, i) => (
        <div key={f.name ?? f.blockType + i} className={`grid gap-1.5 ${f.width === 50 ? '' : 'sm:col-span-2'}`}>
          {f.blockType === 'message' ? <p className="text-sm text-muted-foreground">{plain(f.message)}</p> : null}
          {f.blockType === 'country' || f.blockType === 'state' ? (
            <p className="text-sm text-muted-foreground">lead: src/payload-types.ts {f.blockType} has no options list</p>
          ) : null}
          {f.blockType === 'message' || f.blockType === 'country' || f.blockType === 'state' || !f.name ? null : (
            <>
              <Label htmlFor={f.name}>{f.label ?? f.name}{f.required ? ' *' : ''}</Label>
              {f.blockType === 'textarea' ? (
                <Textarea id={f.name} name={f.name} required={Boolean(f.required)} rows={4} defaultValue={typeof f.defaultValue === 'string' ? f.defaultValue : undefined} />
              ) : f.blockType === 'checkbox' ? (
                <Input id={f.name} name={f.name} type="checkbox" defaultChecked={f.defaultValue === true} className="size-4" />
              ) : f.blockType === 'number' ? (
                <Input id={f.name} name={f.name} type="number" required={Boolean(f.required)} defaultValue={typeof f.defaultValue === 'number' ? f.defaultValue : undefined} />
              ) : f.blockType === 'select' ? (
                f.options?.length ? (
                  <select id={f.name} name={f.name} required={Boolean(f.required)} defaultValue={typeof f.defaultValue === 'string' ? f.defaultValue : ''} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm">
                    {f.placeholder ? <option value="">{f.placeholder}</option> : null}
                    {f.options.map((o) => <option key={o.id ?? o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : <p className="text-sm text-muted-foreground">lead: this select carries no options</p>
              ) : (
                <Input id={f.name} name={f.name} type={f.blockType === 'email' ? 'email' : 'text'} required={Boolean(f.required)} defaultValue={typeof f.defaultValue === 'string' ? f.defaultValue : undefined} />
              )}
            </>
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
