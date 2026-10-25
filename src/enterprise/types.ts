/**
 * Enterprise Multi-Organization Types
 * Support for SaaS licensing, white-label, and team collaboration
 */

export type LicenseTier = 'startup' | 'growth' | 'enterprise' | 'partner';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: LicenseTier;
  status: 'active' | 'suspended' | 'trial' | 'expired';

  // Quotas
  problemQuota: number;
  organizationConnections: number;
  teamMembers: number;
  apiCallsPerMonth: number;

  // API & Access
  apiKey: string;
  apiSecret: string;
  webhookSecret?: string;
  whiteLabelDomain?: string;

  // Customization
  logo?: string;
  brandColor?: string;
  customAlgorithms: string[];

  // Billing
  billingEmail: string;
  paymentMethod: 'card' | 'bank' | 'crypto' | 'invoice';
  monthlyPrice: number;
  billingCycle: 'monthly' | 'annual';

  // Earnings
  earningsSplit: number; // 0-100, percentage org keeps
  walletAddresses: Map<string, string>; // crypto wallets by platform
  bankAccount?: {
    accountNumber: string;
    routingNumber: string;
  };

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  features: OrganizationFeatures;
}

export interface OrganizationFeatures {
  multiCloud: boolean;
  advancedAnalytics: boolean;
  competitiveIntelligence: boolean;
  customAlgorithmSupport: boolean;
  dedicatedSupport: boolean;
  sla?: string; // e.g., "99.99%"
  maxConcurrentSolves: number;
  dataRetentionDays: number;
}

export interface LicenseDefinition {
  tier: LicenseTier;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  problemQuota: number;
  organizationConnections: number;
  teamMembers: number;
  apiCallsPerMonth: number;
  features: OrganizationFeatures;
  description: string;
}

export const LICENSE_TIERS: Record<LicenseTier, LicenseDefinition> = {
  startup: {
    tier: 'startup',
    name: 'Startup',
    monthlyPrice: 10000, // $10K/month
    annualPrice: 100000,
    problemQuota: 10,
    organizationConnections: 1,
    teamMembers: 3,
    apiCallsPerMonth: 10000,
    features: {
      multiCloud: false,
      advancedAnalytics: false,
      competitiveIntelligence: false,
      customAlgorithmSupport: false,
      dedicatedSupport: false,
      maxConcurrentSolves: 1,
      dataRetentionDays: 30
    },
    description: 'Perfect for startups testing quantum problem-solving'
  },

  growth: {
    tier: 'growth',
    name: 'Growth',
    monthlyPrice: 50000, // $50K/month
    annualPrice: 500000,
    problemQuota: 50,
    organizationConnections: 5,
    teamMembers: 10,
    apiCallsPerMonth: 100000,
    features: {
      multiCloud: false,
      advancedAnalytics: true,
      competitiveIntelligence: true,
      customAlgorithmSupport: false,
      dedicatedSupport: true,
      maxConcurrentSolves: 5,
      dataRetentionDays: 90
    },
    description: 'For growing companies scaling quantum operations'
  },

  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 200000, // $200K/month
    annualPrice: 2000000,
    problemQuota: 500,
    organizationConnections: 20,
    teamMembers: 50,
    apiCallsPerMonth: 1000000,
    features: {
      multiCloud: true,
      advancedAnalytics: true,
      competitiveIntelligence: true,
      customAlgorithmSupport: true,
      dedicatedSupport: true,
      sla: '99.99%',
      maxConcurrentSolves: 50,
      dataRetentionDays: 365
    },
    description: 'Enterprise-grade quantum advantage at scale'
  },

  partner: {
    tier: 'partner',
    name: 'Partner',
    monthlyPrice: 83333, // $1M/year
    annualPrice: 1000000,
    problemQuota: 10000,
    organizationConnections: 100,
    teamMembers: 200,
    apiCallsPerMonth: 10000000,
    features: {
      multiCloud: true,
      advancedAnalytics: true,
      competitiveIntelligence: true,
      customAlgorithmSupport: true,
      dedicatedSupport: true,
      sla: '99.99%',
      maxConcurrentSolves: 500,
      dataRetentionDays: 730
    },
    description: 'Strategic partnership with revenue sharing'
  }
};

export interface TeamMember {
  id: string;
  organizationId: string;
  email: string;
  role: 'owner' | 'admin' | 'operator' | 'viewer';
  permissions: string[];
  invitedAt: Date;
  joinedAt?: Date;
  lastActive?: Date;
}

export interface APIKey {
  id: string;
  organizationId: string;
  name: string;
  key: string;
  secret: string;
  permissions: string[];
  rateLimit: number; // requests per minute
  createdAt: Date;
  expiresAt?: Date;
  lastUsed?: Date;
}

export interface OrganizationMetrics {
  organizationId: string;
  problemsSolved: number;
  solutionsSubmitted: number;
  prizesClaimed: number;
  totalEarned: number;
  monthlyEarned: number;
  averageSpeedup: number;
  platformsConnected: number;
  teamMembersActive: number;
  apiCallsThisMonth: number;
  successRate: number; // 0-100
}

export interface Webhook {
  id: string;
  organizationId: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, unknown>;
  timestamp: Date;
  ipAddress?: string;
}
