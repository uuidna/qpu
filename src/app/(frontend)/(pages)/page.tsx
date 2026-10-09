import type { Metadata } from 'next'
import { PublicSurface } from '@/components/Public'
import { pageOf } from '@/app/_data'
import { HOME } from '@/fields/link'
import { metadataOf } from '@/utilities/metadataOf'

export const dynamic = 'force-dynamic'

export const generateMetadata = async (): Promise<Metadata> => metadataOf(await pageOf(HOME))

/** The site root: the lean public surface the unit serves (qpuPageOf), no longer built from Payload blocks. */
export default async function Home() {
  const page = await pageOf(HOME)
  return <PublicSurface breadcrumbs={page?.breadcrumbs} />
}
