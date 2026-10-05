import { qpuHexRegisterOf } from '../../quantum/processing/unit/index.js'
import { crossFormulaOf, type CrossFormula } from '../cross/index.js'

/** CHESS — THE GAME TREE AS ARITHMETIC. A position is numbers: material on the board, the moves a side has, the branching
 *  factor of the search, the nodes a full tree holds, the tempo spent, the score in centipawns, the perft count at a depth,
 *  and the pressure on a king. Crosses to `combinatorics` — chess is counting over a tree. A measure. */

const PROOF = 'chess arithmetic (material, mobility, branching, tree nodes, tempo, centipawns, perft, king safety); the game tree counted exactly; a measure crossed to combinatorics'
const nat = (...xs: number[]) => xs.every((x) => Number.isSafeInteger(x) && x >= 0)
const c = (id: string, formula: string, value: number, holds: boolean, name: string, params: number[], extra: Record<string, unknown> = {}): CrossFormula =>
  crossFormulaOf({ id, src: 'chess', dst: 'combinatorics', formula, value, proof: PROOF, ...extra }, holds, { name: `chess.${name}`, params })

export class ChessFormulas {
  /** MATERIAL: a count of a piece at its value. value count · value. */
  static material(count: number, value: number): CrossFormula { return c('chess-material', 'material(count, value) = count · value', count * value, nat(count, value), 'material', [count, value]) }
  /** MOBILITY: the move advantage of one side over the other. value max(0, white − black). */
  static mobility(white: number, black: number): CrossFormula { return c('chess-mobility', 'mobility(white, black) = max(0, white − black)', Math.max(0, white - black), nat(white, black), 'mobility', [white, black]) }
  /** BRANCHING: the average legal moves per position searched. value ⌊moves / positions⌋. */
  static branching(moves: number, positions: number): CrossFormula { return c('chess-branching', 'branching(moves, positions) = ⌊moves / positions⌋', positions > 0 ? Math.floor(moves / positions) : 0, nat(moves, positions) && positions > 0, 'branching', [moves, positions]) }
  /** PLY TO NODES: a full tree of the given branching to the given ply. value Σ branchingⁱ, i = 0..ply. */
  static plytonodes(branching: number, ply: number): CrossFormula { return c('chess-plytonodes', 'plytonodes(branching, ply) = (branching^(ply+1) − 1) / (branching − 1)', branching - 1 > 0 ? (Math.pow(branching, ply + 1) - 1) / (branching - 1) : 0, nat(branching, ply) && branching > 1, 'plytonodes', [branching, ply]) }
  /** TEMPO: full moves from plies at a given plies-per-move. value ⌊plies / perMove⌋. */
  static tempo(plies: number, perMove: number): CrossFormula { return c('chess-tempo', 'tempo(plies, perMove) = ⌊plies / perMove⌋', perMove > 0 ? Math.floor(plies / perMove) : 0, nat(plies, perMove) && perMove > 0, 'tempo', [plies, perMove]) }
  /** CENTIPAWNS: a pawn score with its hundredths. value pawns · 100 + cents. */
  static centipawns(pawns: number, cents: number): CrossFormula { return c('chess-centipawns', 'centipawns(pawns, cents) = pawns · 100 + cents', pawns * 100 + cents, nat(pawns, cents) && cents < 100, 'centipawns', [pawns, cents]) }
  /** PERFT: the leaf count of a uniform tree at a depth. value branching^depth. */
  static perft(branching: number, depth: number): CrossFormula { return c('chess-perft', 'perft(branching, depth) = branching^depth', Math.pow(branching, depth), nat(branching, depth), 'perft', [branching, depth]) }
  /** KING SAFETY: the attackers a king faces over its defenders. value max(0, attackers − defenders). */
  static kingsafety(attackers: number, defenders: number): CrossFormula { return c('chess-kingsafety', 'kingsafety(attackers, defenders) = max(0, attackers − defenders)', Math.max(0, attackers - defenders), nat(attackers, defenders), 'kingsafety', [attackers, defenders]) }
}

for (const name of ['branching', 'centipawns', 'kingsafety', 'material', 'mobility', 'perft', 'plytonodes', 'tempo'] as const)
  qpuHexRegisterOf('chess', name, (ChessFormulas[name] as (...x: unknown[]) => unknown).bind(ChessFormulas))
