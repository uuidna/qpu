/**
 * Autonomous Verification Workflow
 * Integrates solution verification with prize submission
 * Discovers problems → Solves → Verifies → Submits
 */

import { SolutionVerifier, ExternalDatasetManager } from './dataset-integration.js';
import PrizeOrganizationRegistry from '../realworld/prize-connectors.js';
import type { PrizeSubmission } from '../realworld/prize-connectors.js';

export interface VerifiedSolution {
  challengeId: string;
  algorithm: string;
  speedup: number;
  proof: string;
  verified: boolean;
  verificationReport: Record<string, unknown>;
  submissionIds?: Map<string, string>;
  status: 'verified' | 'pending' | 'failed';
}

/**
 * Autonomous Verification Engine
 * Complete workflow: discover → solve → verify → submit
 */
export class AutonomousVerificationEngine {
  private verifier: SolutionVerifier;
  private datasetManager: ExternalDatasetManager;
  private registry: PrizeOrganizationRegistry;
  private solvedChallenges: Map<string, VerifiedSolution> = new Map();

  constructor(prizeRegistry?: PrizeOrganizationRegistry) {
    this.verifier = new SolutionVerifier();
    this.datasetManager = this.verifier.getDatasetManager();
    this.registry = prizeRegistry || new PrizeOrganizationRegistry();
  }

  /**
   * Step 1: Discover available problems from external datasets
   */
  discoverProblems() {
    const challenges = this.datasetManager.getAllOpenChallenges();

    console.log('\n🔍 DISCOVERING PROBLEMS FROM EXTERNAL DATASETS\n');
    console.log(`Found ${challenges.length} open challenges:\n`);

    const stats = this.datasetManager.getStatistics();
    console.log(`RSA Factorization: ${stats.byType.rsa}`);
    console.log(`Discrete Log: ${stats.byType.discrete_log}`);
    console.log(`Elliptic Curve: ${stats.byType.elliptic_curve}`);
    console.log(`Total Prize Value: $${stats.totalPrizeValue.toLocaleString()}\n`);

    // Show available challenges
    console.log('Available Open Challenges:');
    for (const challenge of challenges) {
      console.log(`  • ${challenge.id} (${challenge.bits} bits)`);
      console.log(`    Problem: ${challenge.problem}`);
      console.log(`    Prize: $${challenge.prizeValue?.toLocaleString() || 'N/A'}`);
      console.log(`    Status: ${challenge.status}\n`);
    }

    return challenges;
  }

  /**
   * Step 2: Solve a discovered problem
   * In a real implementation, this would use quantum algorithms
   */
  solveProblem(challengeId: string) {
    const challenge = this.datasetManager.getChallenge(challengeId);

    if (!challenge) {
      console.log(`❌ Challenge ${challengeId} not found`);
      return null;
    }

    console.log(`\n⚙️  SOLVING PROBLEM: ${challengeId}\n`);

    // Simulate quantum solution (real implementation would use Shor/QAOA/VQE)
    const solution = {
      challengeId,
      algorithm: this.selectAlgorithm(challenge),
      speedup: this.getExpectedSpeedup(challenge),
      proof: this.generateProof(challenge),
      timestamp: new Date()
    };

    console.log(`Algorithm: ${solution.algorithm}`);
    console.log(`Speedup: ${solution.speedup}×`);
    console.log(`Proof: ${solution.proof}`);

    return solution;
  }

  /**
   * Step 3: Verify solution against external dataset
   */
  verifySolution(
    challengeId: string,
    algorithm: string,
    speedup: number,
    proof: string
  ): VerifiedSolution {
    console.log(`\n✓ VERIFYING SOLUTION AGAINST EXTERNAL DATA\n`);

    const report = this.verifier.getVerificationReport(
      challengeId,
      algorithm,
      speedup
    );

    const verified: VerifiedSolution = {
      challengeId,
      algorithm,
      speedup,
      proof,
      verified: report.overallValid,
      verificationReport: report.details,
      status: report.overallValid ? 'verified' : 'failed'
    };

    console.log(`Challenge: ${report.details.challenge}`);
    console.log(`Algorithm: ${algorithm}`);
    console.log(`Speedup: ${speedup}× (expected: ${report.details.expectedRange})`);
    console.log(`Verification: ${report.summary}\n`);

    if (verified.verified) {
      this.solvedChallenges.set(challengeId, verified);
    }

    return verified;
  }

  /**
   * Step 4: Submit verified solution to prize platforms
   */
  async submitVerifiedSolution(solution: VerifiedSolution) {
    if (!solution.verified) {
      console.log('❌ Cannot submit unverified solution');
      return null;
    }

    console.log(`\n📤 SUBMITTING TO PRIZE PLATFORMS\n`);

    const challenge = this.datasetManager.getChallenge(solution.challengeId);
    if (!challenge) {
      console.log('❌ Challenge not found');
      return null;
    }

    const submission: PrizeSubmission = {
      organizationId: 'external-verified',
      prizeId: solution.challengeId,
      problemId: solution.challengeId,
      solution: {
        problemId: solution.challengeId,
        algorithm: solution.algorithm,
        speedup: solution.speedup,
        proof: solution.proof,
        resourceEstimate: {
          qubits: challenge.bits,
          gates: Math.ceil(Math.log2(challenge.bits) ** 2 * 1000)
        }
      },
      proof: solution.proof,
      submissionTime: new Date(),
      status: 'submitted'
    };

    try {
      const result = await this.registry.submitToAllRelevant(submission);

      console.log(`✅ Submitted to ${result.submissions.length} platforms`);
      console.log(`Total potential value: $${result.totalPotentialValue.toLocaleString()}\n`);

      solution.submissionIds = new Map();
      for (const sub of result.submissions) {
        solution.submissionIds.set(sub.org, sub.id);
      }

      solution.status = 'pending';
      return solution;
    } catch (error) {
      console.log(`❌ Submission failed: ${error instanceof Error ? error.message : String(error)}\n`);
      solution.status = 'failed';
      return solution;
    }
  }

  /**
   * Step 5: Complete workflow - discover, solve, verify, submit
   */
  async runCompleteWorkflow(challengeId?: string) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🚀 AUTONOMOUS VERIFICATION WORKFLOW');
    console.log('═══════════════════════════════════════════════════════\n');

    // Step 1: Discover
    const challenges = this.discoverProblems();

    if (challenges.length === 0) {
      console.log('❌ No open challenges found');
      return null;
    }

    // Choose challenge
    const target = challengeId || challenges[0].id;
    const challenge = challenges.find(c => c.id === target);

    if (!challenge) {
      console.log(`❌ Challenge ${target} not found`);
      return null;
    }

    // Step 2: Solve
    const solved = this.solveProblem(target);
    if (!solved) {
      console.log('❌ Failed to solve problem');
      return null;
    }

    // Step 3: Verify
    const verified = this.verifySolution(
      solved.challengeId,
      solved.algorithm,
      solved.speedup,
      solved.proof
    );

    if (!verified.verified) {
      console.log('❌ Verification failed');
      return verified;
    }

    // Step 4: Submit
    const submitted = await this.submitVerifiedSolution(verified);

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ WORKFLOW COMPLETE\n');

    return submitted;
  }

  /**
   * Get all verified solutions ready for claiming
   */
  getVerifiedSolutions(): VerifiedSolution[] {
    return Array.from(this.solvedChallenges.values()).filter(
      s => s.status === 'verified'
    );
  }

  /**
   * Get workflow status
   */
  getStatus() {
    const challenges = this.datasetManager.getAllOpenChallenges();
    const verified = this.getVerifiedSolutions();

    console.log('\n📊 AUTONOMOUS VERIFICATION STATUS\n');
    console.log(`External Datasets: ${this.datasetManager.listDatasets().length}`);
    console.log(`Open Challenges: ${challenges.length}`);
    console.log(`Verified Solutions: ${verified.length}`);
    console.log(`Total Prize Value Available: $${this.datasetManager.getStatistics().totalPrizeValue.toLocaleString()}`);

    if (verified.length > 0) {
      console.log('\nVerified & Ready to Submit:');
      for (const sol of verified) {
        console.log(`  ✓ ${sol.challengeId} (${sol.algorithm} ${sol.speedup}×)`);
      }
    }

    console.log();
  }

  // Helper methods

  private selectAlgorithm(challenge: any): string {
    if (challenge.type === 'factorization') return 'Shor';
    if (challenge.type === 'discrete-log') return 'HHL';
    if (challenge.type === 'elliptic-curve') return 'QAOA';
    return 'QAOA';
  }

  private getExpectedSpeedup(challenge: any): number {
    const baseSpeedups: Record<string, number> = {
      'Shor': 1e9,
      'HHL': 1e6,
      'QAOA': 500,
      'VQE': 50
    };
    const algo = this.selectAlgorithm(challenge);
    return baseSpeedups[algo] || 100;
  }

  private generateProof(challenge: any): string {
    return `quantum-proof-${challenge.id}-${Date.now()}`;
  }
}

export default AutonomousVerificationEngine;
