/**
 * Enterprise Organization Manager
 * Manages multi-tenancy, licensing, teams, and billing
 */

import type {
  Organization,
  LicenseTier,
  TeamMember,
  APIKey,
  OrganizationMetrics,
  Webhook,
  AuditLog
} from './types.js';
import { LICENSE_TIERS } from './types.js';

export class OrganizationManager {
  private organizations: Map<string, Organization> = new Map();
  private teamMembers: Map<string, TeamMember[]> = new Map();
  private apiKeys: Map<string, APIKey[]> = new Map();
  private metrics: Map<string, OrganizationMetrics> = new Map();
  private webhooks: Map<string, Webhook[]> = new Map();
  private auditLogs: Map<string, AuditLog[]> = new Map();

  /**
   * Create new organization (sign-up)
   */
  createOrganization(
    name: string,
    tier: LicenseTier,
    adminEmail: string,
    options?: {
      slug?: string;
      whiteLabelDomain?: string;
      billingEmail?: string;
      paymentMethod?: 'card' | 'bank' | 'crypto';
    }
  ): Organization {
    const id = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const slug = options?.slug || name.toLowerCase().replace(/\s+/g, '-');
    const licenseDefinition = LICENSE_TIERS[tier];

    const org: Organization = {
      id,
      name,
      slug,
      tier,
      status: 'trial',

      // Quotas from license tier
      problemQuota: licenseDefinition.problemQuota,
      organizationConnections: licenseDefinition.organizationConnections,
      teamMembers: licenseDefinition.teamMembers,
      apiCallsPerMonth: licenseDefinition.apiCallsPerMonth,

      // API keys
      apiKey: this.generateAPIKey(),
      apiSecret: this.generateSecret(),

      // Customization
      customAlgorithms: [],

      // Billing
      billingEmail: options?.billingEmail || adminEmail,
      paymentMethod: options?.paymentMethod || 'card',
      monthlyPrice: licenseDefinition.monthlyPrice,
      billingCycle: 'monthly',

      // Wallets
      earningsSplit: 80, // 80/20 split with platform
      walletAddresses: new Map(),

      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day trial
      features: licenseDefinition.features,
      whiteLabelDomain: options?.whiteLabelDomain
    };

    this.organizations.set(id, org);
    this.teamMembers.set(id, [{
      id: `member_${Date.now()}`,
      organizationId: id,
      email: adminEmail,
      role: 'owner',
      permissions: ['all'],
      invitedAt: new Date(),
      joinedAt: new Date()
    }]);

    this.metrics.set(id, {
      organizationId: id,
      problemsSolved: 0,
      solutionsSubmitted: 0,
      prizesClaimed: 0,
      totalEarned: 0,
      monthlyEarned: 0,
      averageSpeedup: 0,
      platformsConnected: 0,
      teamMembersActive: 1,
      apiCallsThisMonth: 0,
      successRate: 0
    });

    this.auditLogs.set(id, [{
      id: `log_${Date.now()}`,
      organizationId: id,
      action: 'created',
      resource: 'organization',
      resourceId: id,
      changes: { tier, status: 'trial' },
      timestamp: new Date()
    }]);

    console.log(`✅ Organization created: ${name} (${tier})`);
    return org;
  }

  /**
   * Get organization by ID
   */
  getOrganization(orgId: string): Organization | undefined {
    return this.organizations.get(orgId);
  }

  /**
   * Upgrade organization tier
   */
  upgradeTier(orgId: string, newTier: LicenseTier): Organization | null {
    const org = this.organizations.get(orgId);
    if (!org) return null;

    const license = LICENSE_TIERS[newTier];

    org.tier = newTier;
    org.problemQuota = license.problemQuota;
    org.organizationConnections = license.organizationConnections;
    org.teamMembers = license.teamMembers;
    org.apiCallsPerMonth = license.apiCallsPerMonth;
    org.monthlyPrice = license.monthlyPrice;
    org.features = license.features;
    org.status = 'active';
    org.updatedAt = new Date();

    this.organizations.set(orgId, org);
    this.logAudit(orgId, 'upgraded_tier', 'organization', orgId, { from: org.tier, to: newTier });

    console.log(`✅ Organization upgraded to ${newTier}`);
    return org;
  }

  /**
   * Get metrics for organization
   */
  getMetrics(orgId: string): OrganizationMetrics | undefined {
    return this.metrics.get(orgId);
  }

  /**
   * Update earnings for organization
   */
  recordEarning(orgId: string, amount: number, platform: string): void {
    const metrics = this.metrics.get(orgId);
    if (!metrics) return;

    metrics.totalEarned += amount;
    metrics.monthlyEarned += amount;
    metrics.prizesClaimed++;
    metrics.updatedAt = new Date();

    this.metrics.set(orgId, metrics);
    this.logAudit(orgId, 'earning_recorded', 'earnings', orgId, { amount, platform });
  }

  /**
   * Add team member
   */
  addTeamMember(
    orgId: string,
    email: string,
    role: 'admin' | 'operator' | 'viewer'
  ): TeamMember | null {
    const org = this.organizations.get(orgId);
    if (!org) return null;

    const members = this.teamMembers.get(orgId) || [];
    if (members.length >= org.teamMembers) {
      console.log('❌ Team member limit reached for this tier');
      return null;
    }

    const member: TeamMember = {
      id: `member_${Date.now()}`,
      organizationId: orgId,
      email,
      role,
      permissions: this.getPermissionsForRole(role),
      invitedAt: new Date()
    };

    members.push(member);
    this.teamMembers.set(orgId, members);
    this.logAudit(orgId, 'team_member_added', 'team', member.id, { email, role });

    return member;
  }

  /**
   * List organization teams
   */
  getTeamMembers(orgId: string): TeamMember[] {
    return this.teamMembers.get(orgId) || [];
  }

  /**
   * Create API key for organization
   */
  createAPIKey(orgId: string, name: string): APIKey | null {
    const org = this.organizations.get(orgId);
    if (!org) return null;

    const apiKey: APIKey = {
      id: `key_${Date.now()}`,
      organizationId: orgId,
      name,
      key: this.generateAPIKey(),
      secret: this.generateSecret(),
      permissions: ['all'],
      rateLimit: 1000, // 1000 req/min
      createdAt: new Date()
    };

    const keys = this.apiKeys.get(orgId) || [];
    keys.push(apiKey);
    this.apiKeys.set(orgId, keys);

    return apiKey;
  }

  /**
   * Get API keys for organization
   */
  getAPIKeys(orgId: string): APIKey[] {
    return this.apiKeys.get(orgId) || [];
  }

  /**
   * Get organization usage stats
   */
  getUsageStats(orgId: string): {
    usage: number;
    limit: number;
    percentUsed: number;
  } | null {
    const org = this.organizations.get(orgId);
    const metrics = this.metrics.get(orgId);
    if (!org || !metrics) return null;

    const percentUsed = (metrics.apiCallsThisMonth / org.apiCallsPerMonth) * 100;
    return {
      usage: metrics.apiCallsThisMonth,
      limit: org.apiCallsPerMonth,
      percentUsed
    };
  }

  /**
   * List all organizations (admin only)
   */
  listOrganizations(tier?: LicenseTier): Organization[] {
    const orgs = Array.from(this.organizations.values());
    if (tier) {
      return orgs.filter(o => o.tier === tier);
    }
    return orgs;
  }

  /**
   * Get organization statistics
   */
  getOrganizationStats() {
    const all = Array.from(this.organizations.values());
    const byTier = {
      startup: all.filter(o => o.tier === 'startup').length,
      growth: all.filter(o => o.tier === 'growth').length,
      enterprise: all.filter(o => o.tier === 'enterprise').length,
      partner: all.filter(o => o.tier === 'partner').length
    };

    const totalEarnings = Array.from(this.metrics.values()).reduce(
      (sum, m) => sum + m.totalEarned,
      0
    );

    return {
      totalOrganizations: all.length,
      activeOrganizations: all.filter(o => o.status === 'active').length,
      byTier,
      totalEarnings,
      totalTeamMembers: Array.from(this.teamMembers.values()).reduce(
        (sum, members) => sum + members.length,
        0
      )
    };
  }

  // Helper methods

  private generateAPIKey(): string {
    return `qpu_${Date.now()}_${Math.random().toString(36).substr(2, 32)}`;
  }

  private generateSecret(): string {
    return Math.random().toString(36).substr(2, 64);
  }

  private getPermissionsForRole(role: string): string[] {
    const permissions: Record<string, string[]> = {
      admin: ['all'],
      operator: ['solve', 'submit', 'view-earnings', 'manage-webhooks'],
      viewer: ['view-earnings', 'view-metrics']
    };
    return permissions[role] || [];
  }

  private logAudit(
    orgId: string,
    action: string,
    resource: string,
    resourceId: string,
    changes: Record<string, unknown>
  ): void {
    const logs = this.auditLogs.get(orgId) || [];
    logs.push({
      id: `log_${Date.now()}`,
      organizationId: orgId,
      action,
      resource,
      resourceId,
      changes,
      timestamp: new Date()
    });
    this.auditLogs.set(orgId, logs);
  }
}

export default OrganizationManager;
