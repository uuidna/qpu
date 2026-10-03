import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { RenderBlocks, type SearchParams } from '@/components/RenderBlocks'
import { pageOf } from '@/app/_data'
import { HOME } from '@/fields/link'
import { metadataOf } from '@/utilities/metadataOf'

export const dynamic = 'force-dynamic'
type Props = { searchParams: Promise<SearchParams> }

export const generateMetadata = async (): Promise<Metadata> => metadataOf(await pageOf(HOME))

/** The site root is the page `home`, built from blocks in the admin. */
export default async function Home({ searchParams }: Props) {
  const page = await pageOf(HOME)
  if (!page) notFound()
  return <RenderBlocks blocks={page.layout} searchParams={await searchParams} />
}
