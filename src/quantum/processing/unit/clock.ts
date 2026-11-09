// The one clock of the tree. A pure module answers as a function of its arguments, so the time it needs comes in as `now` (milliseconds since
// the epoch) and only this module reads the process clock when no `now` was given; every other file calls clock(now) or stamp(now), never
// Date.now() or new Date() itself. The entropy audit names this file as the clock's registry and counts a clock anywhere else.
// The process clock is the device's own oscillator at full resolution, not the wall clock: it does not step when the system time is set
// and it resolves below a millisecond. The oscillator is disciplined to UTC, which caesium clocks keep: the SI second is ΔνCs periods of
// the caesium-133 hyperfine transition (`PhysicalConstant.deltaNuCs`), the quantum clock every reading traces to.
const device = () => performance.timeOrigin + performance.now()
/** Milliseconds since the epoch: the `now` given, else the process clock. */
export const clock = (now?: number): number => (typeof now === 'number' && Number.isFinite(now) ? now : device())
/** The ISO 8601 instant of clock(now). */
export const stamp = (now?: number): string => new Date(clock(now)).toISOString()
/** Seconds since the epoch, whole: the `now` given in seconds or milliseconds (a value past the year 2286 in seconds is read as milliseconds), else the process clock. */
export const seconds = (now?: number): number => (typeof now === 'number' && Number.isFinite(now) ? (now > 1e11 ? Math.floor(now / 1000) : Math.floor(now)) : Math.floor(device() / 1000))
