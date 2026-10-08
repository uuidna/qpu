import { CinemaFormulas } from '../../families/cinema/index.js'
import { MediaFormulas } from '../../families/media/index.js'
import { qpuLatticeNamesOf } from '../../quantum/processing/unit/index.js'
import { clayPrizeOf } from './clay.js'
import type { QpuPlugin } from './surface.js'

/**
 * The video path the unit already has: cinema.frames and cinema.aspect parse a clip's counts, media.caption analyses
 * a caption length. One reading for every domain. No second decoder, no fetched bytes, no transcript.
 *
 * A Clay lecture is not in this reading unless the tree already names its address. The api receipt already denies the
 * video hosts a keyless read would need. None of those hosts is called. A lecture is not a prize.
 */

type Reading = { family: string; formula: string; uuid?: string; value: unknown; holds: boolean }

const row = (family: string, formula: string, run: { hex?: string; value: unknown; holds: boolean }): Reading => ({
  family,
  formula,
  uuid: run.hex,
  value: run.value,
  holds: run.holds,
})

/** Parse and analyse one clip from counts the cinema and media formulas already take. No address is fetched. */
export const videoParseOf = (clip: { seconds: number; fps: number; width: number; height: number; chars: number; max: number }) => {
  const frames = CinemaFormulas.frames(clip.seconds, clip.fps)
  const aspect = CinemaFormulas.aspect(clip.width, clip.height)
  const caption = MediaFormulas.caption(clip.chars, clip.max)
  const analysed = [row('cinema', 'frames', frames), row('cinema', 'aspect', aspect), row('media', 'caption', caption)]
  return {
    kind: 'video-parse' as const,
    parsed: { seconds: clip.seconds, fps: clip.fps, width: clip.width, height: clip.height, chars: clip.chars, max: clip.max },
    analysed,
    holds: analysed.every((r) => r.holds === true),
    lecture: false as const,
  }
}

/** The parser recomputes on the lattice's own counts. This is not a lecture. */
export const videoParserOf = () => {
  const lattice = qpuLatticeNamesOf()
  const reading = videoParseOf({
    seconds: lattice.coins,
    fps: lattice.seed,
    width: lattice.coins,
    height: lattice.seed,
    chars: lattice.seed,
    max: lattice.coins,
  })
  return { ...reading, kind: 'video-parser' as const, by: 'qpuLatticeNamesOf' }
}

/** Every Clay-related video the tree names, then the video hosts the receipt already denies. Nothing is fetched. */
export const clayVideosOf = () => {
  const named: { name: string; address: string }[] = []
  const denied = [
    { where: 'googleapis.com:youtube', why: '76 operations · no read without parameters' },
    { where: 'googleapis.com:youtubeAnalytics', why: '0 operations · no read without parameters' },
    { where: 'googleapis.com:youtubereporting', why: '8 operations · 401 https://youtubereporting.googleapis.com/v1/jobs' },
    { where: 'vimeo.com', why: '326 operations · 401 https://api.vimeo.com/' },
    { where: 'api.video', why: '47 operations · 401 https://ws.api.video/account' },
    { where: 'amazonaws.com:kinesis-video-archived-media', why: '6 operations · no read without parameters' },
    { where: 'amazonaws.com:kinesis-video-media', why: '1 operations · no read without parameters' },
  ]
  const citation = clayPrizeOf().citation
  const tested = named.map((video) => ({ ...video, parsed: null, analysed: null, holds: false as const, lead: true as const }))
  return {
    kind: 'clay-videos' as const,
    tested,
    named: named.length,
    denied,
    citation,
    holds: false as const,
    lead: true as const,
  }
}

export const videoPlugin = (): QpuPlugin => (config) => ({
  ...config,
  endpoints: [...(config.endpoints ?? []), {
    path: '/qpu/video',
    method: 'get' as const,
    handler: () => Response.json({ parser: videoParserOf(), clay: clayVideosOf() }),
  }],
})
