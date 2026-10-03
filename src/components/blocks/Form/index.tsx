import { BlockWrapper } from '@/components/BlockWrapper'
import { CMSForm, type FormField } from '@/components/CMSForm'
import { plainOf } from '@/app/_data'
import type { FormBlock } from '@/payload-types'

/** A form-builder form, its fields as the admin built them, submitted to form-submissions. */
export function Form({ heading, intro, anchor, form }: FormBlock) {
  if (!form || typeof form !== 'object') return null
  return (
    <BlockWrapper heading={heading ?? form.title} intro={intro} anchor={anchor}>
      <div className="max-w-2xl">
        <CMSForm formId={form.id} fields={(form.fields ?? []) as unknown as FormField[]} submitLabel={form.submitButtonLabel ?? 'Send'} confirmation={plainOf(form.confirmationMessage) || 'Thank you.'} />
      </div>
    </BlockWrapper>
  )
}
