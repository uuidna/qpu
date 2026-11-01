// Any Google call of the app asked of the qpu-google-call job in this request: the entry of kind call is created, the entries hook runs the
// job before create answers, and the answer entry's body is read back. No Google call is made here (textbook_google_one_door).
import type { Payload, PayloadRequest } from 'payload'

export const askJob = async (payload: Payload, body: Record<string, unknown>, req?: PayloadRequest): Promise<{ allowed?: boolean; why?: string | null; status?: number | null; answer?: string | null } | undefined> => {
  const asked = await payload.create({ collection: 'entries' as never, overrideAccess: true, req, data: { kind: 'call', from: 'qpu-google-call', body } as never })
  return ((await payload.find({ collection: 'entries' as never, where: { from: { equals: 'qpu-google-call' }, 'body.request': { equals: (asked as { id: string }).id } }, limit: 1, depth: 0, overrideAccess: true, req })).docs[0] as { body?: never } | undefined)?.body
}
