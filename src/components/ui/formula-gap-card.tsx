import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'

export interface GapData {
  from: string
  to: string
  discovered: boolean
  formulaCount: number
  impact: 'critical' | 'high' | 'medium' | 'low'
  reason: string
}

export interface FormulaGapCardProps {
  title: string
  totalPairs: number
  discoveredPairs: number
  criticalGaps: number
  highPriorityGaps: number
  gaps: GapData[]
}

export const FormulaGapCard: React.FC<FormulaGapCardProps> = ({
  title,
  totalPairs,
  discoveredPairs,
  criticalGaps,
  highPriorityGaps,
  gaps
}) => {
  const coverage = (discoveredPairs / totalPairs) * 100
  const remaining = totalPairs - discoveredPairs

  const impactConfig = {
    critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', badge: 'destructive' },
    high: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', badge: 'secondary' },
    medium: { icon: CheckCircle2, color: 'text-yellow-500', bg: 'bg-yellow-50', badge: 'outline' },
    low: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', badge: 'outline' }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>Cross-domain formula network status</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Coverage Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Total Pairs</div>
            <div className="text-2xl font-bold">{totalPairs}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-green-700 mb-1">Connected</div>
            <div className="text-2xl font-bold text-green-700">{discoveredPairs}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-red-700 mb-1">Critical Gaps</div>
            <div className="text-2xl font-bold text-red-700">{criticalGaps}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-700 mb-1">High Priority</div>
            <div className="text-2xl font-bold text-orange-700">{highPriorityGaps}</div>
          </div>
        </div>

        {/* Coverage Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">Overall Coverage</span>
            <span className="text-muted-foreground">{coverage.toFixed(1)}% ({remaining} remaining)</span>
          </div>
          <Progress value={coverage} className="h-3" />
        </div>

        {/* Critical Gaps Table */}
        {gaps.filter(g => g.impact === 'critical').length > 0 && (
          <div>
            <div className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critical Gaps ({criticalGaps})
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gaps.filter(g => g.impact === 'critical').map((gap, idx) => (
                <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {gap.from.toUpperCase()} → {gap.to.toUpperCase()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{gap.reason}</div>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* High Priority Gaps Preview */}
        {gaps.filter(g => g.impact === 'high').length > 0 && (
          <div>
            <div className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              High Priority Gaps (showing first 5 of {highPriorityGaps})
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {gaps.filter(g => g.impact === 'high').slice(0, 5).map((gap, idx) => (
                <div key={idx} className="p-2 bg-orange-50 border border-orange-200 rounded text-xs flex justify-between items-center">
                  <span>{gap.from} ↔ {gap.to}</span>
                  <Badge variant="secondary">High</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap */}
        <div className="pt-4 border-t">
          <div className="text-sm font-semibold mb-3">Closure Roadmap</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Phase 10: 8 convergence formulas ✅</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>Phase 11: +24 critical formulas (target)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>Phase 12: Fill remaining {Math.max(0, remaining - (24 + 8))} gaps (AI discovery)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
