import { blockFields } from '../../fields/blockFields'

export const Animation = blockFields('Animation', 'QPU', 'A formula animated: its values over its parameters drawn and traced as it runs, with the cross formula that reaches the same value traced beside it, the two meeting where the discovery says they meet.', [
  { name: 'family', type: 'text', admin: { description: 'the family (default: the first that is not a door)' } },
  { name: 'formula', type: 'text', admin: { description: 'the formula (default: the first of the family)' } },
  { name: 'take', type: 'number', min: 2, max: 64, admin: { description: 'how many parameters to run, from 1 (default: faces)' } },
])
