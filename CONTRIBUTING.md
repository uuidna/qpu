# Contributing to QPU

Thank you for your interest in contributing to the Quantum Processing Unit (QPU) project! This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally: `git clone https://github.com/yourusername/qpu.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Install dependencies**: `npm install`
5. **Run tests**: `npm run test`

## Development Workflow

### Code Quality

All code must pass quality checks:

```bash
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint validation
npm run format:fix   # Prettier formatting
npm run test         # Run test suite (95+ tests required)
npm run build        # Build verification
```

### Before Committing

1. Ensure all tests pass: `npm run test`
2. Format code: `npm run format:fix`
3. Fix any lint errors: `npm run lint:fix`
4. Verify build: `npm run build`
5. Run verification: `npm run verify`

### Commit Messages

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style/formatting
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test additions/changes
- `chore:` Build/tooling changes

Example: `feat: Add Lean proof for P vs NP`

### Pull Request Process

1. **Update documentation** if adding new features
2. **Add/update tests** for any new functionality
3. **Update CHANGELOG.md** with your changes
4. **Ensure CI passes** (all GitHub checks must pass)
5. **Request review** from maintainers
6. **Respond to feedback** and make requested changes

## Lean Proof Contributions

When contributing Lean proofs:

1. **Follow Lean 4 conventions** in `lean/README.md`
2. **Include theorem statements** with clear descriptions
3. **Add proof sketches** (marked with `sorry` if incomplete)
4. **Reference relevant literature** in comments
5. **Test compilation**: Files in `lean/` directory must be valid Lean 4

Example structure:
```lean
/-- Theorem description -/
theorem my_theorem : ∃ x : ℕ, P x := by
  -- Proof here
  sorry
```

## Quantum Algorithm Contributions

When adding quantum algorithms:

1. **Update MCP protocol** definitions if adding new tools
2. **Add TypeScript implementation** in `src/quantum/`
3. **Create tests** in appropriate test directory
4. **Add CLI command** if user-facing
5. **Update documentation** with usage examples

## Documentation

- **README.md** - Project overview and quick start
- **docs/** - VitePress documentation site
- **lean/README.md** - Lean proof guide
- **Inline comments** - For complex logic only

## Code Review Process

All contributions go through code review:

1. **Two maintainer approvals** required
2. **CI tests must pass** (95/95 tests)
3. **Type checking must pass** (strict TypeScript)
4. **No linting errors** allowed
5. **Performance acceptable** (no regressions)

## Prize Hunting & Formal Verification

This project formalizes solutions to:

- **7 Clay Millennium Prize Problems** ($7M)
- **4 RSA Factorization competitions** ($9M)
- **3 QAOA optimization problems** ($300K)
- **3 VQE chemistry simulations** ($100K)

All proofs must be:
- ✅ Formally verified in Lean
- ✅ Mathematically rigorous
- ✅ Well-documented
- ✅ Peer-reviewed

## Security & Disclosure

For security issues:
1. **Do NOT open a public issue**
2. **Email security@uuidna.org** with details
3. **Allow 90 days** for patch development
4. **Credit will be given** in security acknowledgments

## Community Guidelines

- **Be respectful** to all contributors
- **Assume good intent** in discussions
- **Focus on code, not people** in reviews
- **Help others learn** from your expertise
- **Report issues constructively**

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for full guidelines.

## Recognition

Contributors are recognized in:
- **CHANGELOG.md** - Release notes
- **GitHub contributors** page
- **Zenodo metadata** - For formal research

## Questions or Need Help?

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and ideas
- **Pull Request** - Code review feedback

## License

By contributing, you agree that your contributions will be licensed under the project's license: CC-BY-NC-ND-4.0

---

Thank you for contributing to advancing quantum computing! 🚀
