// A concern, not a model. The app generator only keeps this directory; Zeitwerk loads it because the glob is `{*,*/concerns}`.
// Included on ApplicationRecord, the macro validates every instance online. verify is the instance method and the class method.
export { onlineValidation, includeConcern, validateOnline } from '../../../generators/index.ts'
