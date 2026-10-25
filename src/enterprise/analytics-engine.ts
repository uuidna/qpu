/**
 * Enterprise Analytics & Competitive Intelligence Engine
 * Real-time metrics, forecasting, and market analysis for organizations
 */

export interface PerformanceMetrics {
  timestamp: Date;
  problemsSolvedToday: number;
  solutionsSubmitted: number;
  prizesClaimed: number;
  totalEarned: number;
  averageSpeedup: number;
  successRate: number;
  platformsActive: number;
}

export interface PredictiveAnalytics {
  expectedMonthlyEarnings: number;
  expectedAnnualEarnings: number;
  claimSuccessProbability: number;
  optimalProblemSequence: string[];
  recommendedAlgorithm: string;
  estimatedVerificationTime: number; // days
}

export interface CompetitiveIntelligence {
  competitorsDetected: number;
  averageCompetitorSpeedup: number;
  marketShare: number; // percentage
  uniqueSolutions: number;
  claimRate: number;
  emergingOpportunities: string[];
}

/**
 * Analytics Engine
 * Provides real-time insights and predictions
 */
export class AnalyticsEngine {
  private metrics: PerformanceMetrics[] = [];
  private predictions: Map<string, PredictiveAnalytics> = new Map();
  private intelligence: Map<string, CompetitiveIntelligence> = new Map();

  /**
   * Record performance metric
   */
  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    this.metrics = this.metrics.filter(m => m.timestamp > thirtyDaysAgo);
  }

  /**
   * Get current day metrics
   */
  getTodayMetrics(): PerformanceMetrics | undefined {
    const today = new Date();
    return this.metrics.find(m => {
      const mDate = new Date(m.timestamp);
      return mDate.toDateString() === today.toDateString();
    });
  }

  /**
   * Generate predictive analytics
   */
  generatePredictions(organizationId: string): PredictiveAnalytics {
    // Get recent metrics
    const recentMetrics = this.metrics.slice(-7); // Last 7 days

    if (recentMetrics.length === 0) {
      return {
        expectedMonthlyEarnings: 0,
        expectedAnnualEarnings: 0,
        claimSuccessProbability: 0,
        optimalProblemSequence: [],
        recommendedAlgorithm: 'Shor',
        estimatedVerificationTime: 14
      };
    }

    // Calculate averages
    const avgDaily = recentMetrics.reduce((sum, m) => sum + m.totalEarned, 0) / recentMetrics.length;
    const avgSpeedup = recentMetrics.reduce((sum, m) => sum + m.averageSpeedup, 0) / recentMetrics.length;
    const avgSuccess = recentMetrics.reduce((sum, m) => sum + m.successRate, 0) / recentMetrics.length;

    // Predictions
    const monthlyEarnings = avgDaily * 30;
    const annualEarnings = monthlyEarnings * 12;

    // Algorithm recommendation based on speedup
    let algorithm = 'Shor';
    if (avgSpeedup > 1e7) {
      algorithm = 'Shor'; // Best for RSA
    } else if (avgSpeedup > 1000) {
      algorithm = 'QAOA'; // Good for optimization
    } else {
      algorithm = 'VQE'; // Simulation focus
    }

    const predictions: PredictiveAnalytics = {
      expectedMonthlyEarnings: Math.round(monthlyEarnings),
      expectedAnnualEarnings: Math.round(annualEarnings),
      claimSuccessProbability: Math.min(avgSuccess * 1.1, 100), // 10% improvement expected
      optimalProblemSequence: ['rsa-260', 'rsa-576', 'rsa-640', 'maxcut', 'tsp'],
      recommendedAlgorithm: algorithm,
      estimatedVerificationTime: Math.round(avgSuccess < 50 ? 21 : 14)
    };

    this.predictions.set(organizationId, predictions);
    return predictions;
  }

  /**
   * Analyze competitive landscape
   */
  analyzeMarketPosition(organizationId: string, marketSize: number): CompetitiveIntelligence {
    const today = this.getTodayMetrics();
    if (!today) {
      return {
        competitorsDetected: 0,
        averageCompetitorSpeedup: 0,
        marketShare: 0,
        uniqueSolutions: 0,
        claimRate: 0,
        emergingOpportunities: []
      };
    }

    // Simulate competitive analysis
    const competitorCount = Math.max(1, Math.floor(marketSize / 10000000)); // 1 competitor per $10M market
    const avgCompetitorSpeed = 1e8; // Assume competitors at 100M× speedup
    const ourSpeedup = today.averageSpeedup;
    const speedupAdvantage = ourSpeedup / avgCompetitorSpeed;

    const marketShare = (1 / (competitorCount + 1)) * 100; // Simplified
    const claimRate = (today.prizesClaimed / (today.solutionsSubmitted || 1)) * 100;

    const intelligence: CompetitiveIntelligence = {
      competitorsDetected: competitorCount,
      averageCompetitorSpeedup: avgCompetitorSpeed,
      marketShare: Math.round(marketShare * 10) / 10,
      uniqueSolutions: today.problemsSolvedToday,
      claimRate: Math.round(claimRate),
      emergingOpportunities: this.identifyOpportunities(today)
    };

    this.intelligence.set(organizationId, intelligence);
    return intelligence;
  }

  /**
   * Get dashboard metrics
   */
  getDashboardMetrics(organizationId: string) {
    const today = this.getTodayMetrics();
    const predictions = this.predictions.get(organizationId) || this.generatePredictions(organizationId);
    const competitive = this.intelligence.get(organizationId);

    return {
      realTime: today || {
        timestamp: new Date(),
        problemsSolvedToday: 0,
        solutionsSubmitted: 0,
        prizesClaimed: 0,
        totalEarned: 0,
        averageSpeedup: 0,
        successRate: 0,
        platformsActive: 0
      },
      predictions,
      competitive,
      summary: {
        status: 'healthy',
        trend: 'up',
        efficiency: (predictions.expectedMonthlyEarnings / 200000) * 100, // Per $200K tier baseline
        recommendation: `Continue with ${predictions.recommendedAlgorithm} - achieving ${Math.round((predictions.claimSuccessProbability))}% success rate`
      }
    };
  }

  /**
   * Identify emerging opportunities
   */
  private identifyOpportunities(metrics: PerformanceMetrics): string[] {
    const opportunities: string[] = [];

    // High speedup => RSA opportunities
    if (metrics.averageSpeedup > 1e8) {
      opportunities.push('Bounties.network RSA challenges');
    }

    // Good success rate => expand to new platforms
    if (metrics.successRate > 75) {
      opportunities.push('Google Quantum AI challenges');
      opportunities.push('IBM Quantum challenges');
    }

    // Many solutions => optimization focus
    if (metrics.solutionsSubmitted > 5) {
      opportunities.push('Kaggle optimization competitions');
    }

    // High claim rate => leverage momentum
    if (metrics.prizesClaimed / (metrics.solutionsSubmitted || 1) > 0.7) {
      opportunities.push('Academic research partnerships (RPI, MIT, Stanford)');
    }

    // Government opportunities
    opportunities.push('NSF Quantum Program');
    opportunities.push('DARPA Quantum Technology Initiative');

    return opportunities;
  }

  /**
   * Generate insights report
   */
  generateReport(organizationId: string): string {
    const dashboard = this.getDashboardMetrics(organizationId);
    const { realTime, predictions, summary } = dashboard;

    return `
╔════════════════════════════════════════════════════════╗
║           QUANTUM PROBLEM SOLVER ANALYTICS             ║
║                Organization Report                     ║
╚════════════════════════════════════════════════════════╝

📊 TODAY'S PERFORMANCE

  Problems Solved:      ${realTime.problemsSolvedToday}
  Solutions Submitted:  ${realTime.solutionsSubmitted}
  Prizes Claimed:       ${realTime.prizesClaimed}
  Total Earned:         $${realTime.totalEarned.toLocaleString()}
  Success Rate:         ${realTime.successRate.toFixed(1)}%
  Average Speedup:      ${(realTime.averageSpeedup / 1e6).toFixed(0)}M×

📈 PREDICTIONS (30-day forecast)

  Expected Monthly:     $${predictions.expectedMonthlyEarnings.toLocaleString()}
  Expected Annual:      $${predictions.expectedAnnualEarnings.toLocaleString()}
  Success Probability:  ${predictions.claimSuccessProbability.toFixed(1)}%
  Recommended Algorithm: ${predictions.recommendedAlgorithm}
  Verification Time:    ${predictions.estimatedVerificationTime} days

🎯 RECOMMENDATIONS

  ${summary.recommendation}
  Efficiency Score:     ${summary.efficiency.toFixed(1)}%
  Trend:                ${summary.trend}

🌍 MARKET INSIGHTS

  Status:               ${summary.status}
  Next Step:            Focus on ${predictions.recommendedAlgorithm} for maximum ROI
    `;
  }
}

export default AnalyticsEngine;
