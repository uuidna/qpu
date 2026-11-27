// Binding 0. A document sits at the three middle groups of its address, then the address.

export const pathOf = (id: string) => {
  const [, a, b, c] = id.split('-')
  return `${a}/${b}/${c}/${id}`
}

const hex = { pkg: 'hex' as const, path: pathOf }
export default hex
