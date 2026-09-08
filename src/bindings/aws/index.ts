import { providerOf } from '../drive.js'
import { AWS_BINDINGS } from './kinds.js'

export { AWS_BINDINGS }
export const aws = providerOf('aws', AWS_BINDINGS)
