// A path or origin without its trailing slashes, read from the end in one pass: linear in its length, so a value made of many
// slashes costs no more than any other (a /\/+$/ replace backtracks on every slash; CodeQL js/polynomial-redos).
export const trimTrailingSlashes = (value: string): string => {
  let end = value.length
  while (end > 0 && value.charCodeAt(end - 1) === 47) end--
  return value.slice(0, end)
}
