// Online reads on the quantum OS.
// The browser, the worker, and Node each already have fetch. This uses that one.
// No host binary and no local browser.

import { PROSE } from '../processing/prose-index.ts'
type OnlinePage = { url: string; status: number; text: string }

const readOne = async (url: string): Promise<OnlinePage> => {
  if (typeof globalThis.fetch !== 'function') return { url, status: 0, text: '' }
  try {
    const res = await globalThis.fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
      headers: {
        accept: 'text/html,application/json,application/x-ndjson,*/*',
        'user-agent': PROSE.quantumOsFetch_s1,
      },
    })
    return { url, status: res.status, text: (await res.text()) }
  } catch {
    return { url, status: 0, text: '' }
  }
}

/** Every named URL, read by the OS fetch. A URL that does not answer is status 0 and an empty body. */
export const readOnline = (urls: readonly string[]) => Promise.all(urls.map((url) => readOne(url)))
