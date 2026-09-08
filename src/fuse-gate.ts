// fuse-gate — occupancy exports qpu*Of / QPU_*. Provider folders stay behind GET /bindings.
// Named uuidna.com doors only. No wildcards. Workers-safe: regex on names, never a crawl.

/** Fused QPU door. Occupancy imports this file, never a provider folder. */
export const QPU_FUSE_DOOR = 'bindings/index.js' as const

/** Provider folders. Occupancy source that matches this import is refused. */
export const QPU_FUSE_REFUSE_IMPORT =
  /from\s+['"][^'"]*bindings\/(cloudflare|google|aws|azure|ibm|oracle|hardware|arch)(?:\/|\.js)/

/** Occupancy constructors and holds. */
export const QPU_OCCUPANCY_EXPORT = /^qpu[A-Z][A-Za-z0-9]*(Of|Holds)$/

/** Occupancy tables. */
export const QPU_OCCUPANCY_CONST = /^QPU_[A-Z0-9_]+$/

export const qpuFuseImportHolds = (source: string): boolean =>
  typeof source === 'string' && !QPU_FUSE_REFUSE_IMPORT.test(source)

export const qpuOccupancyExportHolds = (name: string): boolean =>
  QPU_OCCUPANCY_EXPORT.test(name) || QPU_OCCUPANCY_CONST.test(name)
