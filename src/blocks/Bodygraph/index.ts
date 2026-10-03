import { blockFields } from '../../fields/blockFields'

/** The Human Design structure at a Julian day: the wheel's gates for the Sun and Earth at birth and at the design
 *  day, the channels they define among the nine centers, and the definition — the hex family `hd`, drawn. Structure
 *  only; the block states no type, profile or authority. */
export const Bodygraph = blockFields(
  'Bodygraph',
  'QPU',
  'The Human Design structure as the hex family hd computes it: the Rave Mandala wheel (64 gates of 6 lines), the nine centers, the 36 channels, the Sun and Earth at birth and at the design day, and the definition. Structure only: profiling people by it carries no signal and is not done.',
  [{ name: 'jd', type: 'number', min: 1, admin: { description: 'a birth Julian day (empty: ?jd= on the page, else J2000 = 2451545)' } }],
)
