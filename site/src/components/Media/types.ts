import type { StaticImageData } from 'next/image'
import type { TypedUploadCollection } from 'payload'
import type { ElementType, Ref } from 'react'

export interface Props {
  alt?: string
  className?: string
  fill?: boolean // for NextImage only
  height?: null | number
  htmlElement?: ElementType | null
  imgClassName?: string
  onClick?: () => void
  onLoad?: () => void
  priority?: boolean // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>
  resource?: TypedUploadCollection['media'] // for Payload media: the media collection alone, not every upload collection plugins add (the import-export records are uploads too)
  sizes?: string // for NextImage only
  src?: null | StaticImageData | string // for static media
  videoClassName?: string
  width?: null | number
}
