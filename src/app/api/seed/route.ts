import { NextResponse } from 'next/server'
import { payloadOf } from '@/app/_data'
import { seedStateOf } from '@/seed'

/** The seed's state: done, or the cursor of the slice in progress and the last failure — what a reader needs when a
 *  page still shows text the content has moved past. */
export async function GET() {
  const payload = await payloadOf()
  return NextResponse.json(await seedStateOf(payload), { headers: { 'cache-control': 'no-store' } })
}
