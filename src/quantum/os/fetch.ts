// Online reads on the quantum OS.
// The browser, the worker, and Node each already have fetch. This uses that one.
// No host binary and no local browser.

type OnlinePage = { url: string; status: number; text: string }

const readOne = async (url: string): Promise<OnlinePage> => {
  if (typeof globalThis.fetch !== 'function') return { url, status: 0, text: '' }
  try {
    const res = await globalThis.fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(12000),
      headers: {
        accept: 'text/html,application/json,application/x-ndjson,*/*',
        'user-agent': 'Mozilla/5.0 (compatible; QPUResearch/1.0; +https://qpu.uuidna.com)',
      },
    })
    return { url, status: res.status, text: (await res.text()).slice(0, 4000000) }
  } catch {
    return { url, status: 0, text: '' }
  }
}

/** Every named URL, read by the OS fetch. A URL that does not answer is status 0 and an empty body. */
export const readOnline = (urls: readonly string[]) => Promise.all(urls.map((url) => readOne(url)))
