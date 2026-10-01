import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export interface MCPOSLayer {
  name: string
  description: string
  implemented: number
  needed: number
  severity: 'critical' | 'high' | 'medium'
  operations: string[]
}

export interface MCPOSDashboardProps {
  title?: string
  layers: MCPOSLayer[]
  totalImplemented: number
  totalNeeded: number
}

export const MCPOSDashboard: React.FC<MCPOSDashboardProps> = ({
  title = 'MCP OS Infrastructure',
  layers,
  totalImplemented,
  totalNeeded
}) => {
  const coverage = (totalImplemented / totalNeeded) * 100

  const severityConfig = {
    critical: { icon: AlertTriangle, color: 'bg-red-500', text: 'text-red-700' },
    high: { icon: AlertCircle, color: 'bg-orange-500', text: 'text-orange-700' },
    medium: { icon: Clock, color: 'bg-yellow-500', text: 'text-yellow-700' }
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>Infrastructure gap analysis across 10 operational layers</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-lg">Overall Coverage</h3>
                <p className="text-sm text-muted-foreground">{totalImplemented} of {totalNeeded} operations</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{coverage.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">{totalNeeded - totalImplemented} gaps</div>
              </div>
            </div>
            <Progress value={coverage} className="h-4" />
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xs text-green-700 font-semibold mb-1">IMPLEMENTED</div>
              <div className="text-2xl font-bold text-green-700">{totalImplemented}</div>
              <div className="text-xs text-green-600 mt-1">Ready to use</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xs text-red-700 font-semibold mb-1">CRITICAL GAPS</div>
              <div className="text-2xl font-bold text-red-700">
                {layers.filter(l => l.severity === 'critical').reduce((sum, l) => sum + (l.needed - l.implemented), 0)}
              </div>
              <div className="text-xs text-red-600 mt-1">Blocks production</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-xs text-orange-700 font-semibold mb-1">HIGH PRIORITY</div>
              <div className="text-2xl font-bold text-orange-700">
                {layers.filter(l => l.severity === 'high').reduce((sum, l) => sum + (l.needed - l.implemented), 0)}
              </div>
              <div className="text-xs text-orange-600 mt-1">Needed soon</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layer Details */}
      <div className="space-y-4">
        {layers.map((layer, idx) => {
          const layerCoverage = layer.implemented / layer.needed
          const SeverityIcon = severityConfig[layer.severity].icon
          const gaps = layer.needed - layer.implemented

          return (
            <Card key={idx}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <SeverityIcon className={`w-5 h-5 ${severityConfig[layer.severity].text}`} />
                      <CardTitle className="text-lg">{layer.name}</CardTitle>
                      <Badge variant="outline">{layer.implemented}/{layer.needed}</Badge>
                    </div>
                    <CardDescription>{layer.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Layer Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Coverage</span>
                    <span className="font-medium">{(layerCoverage * 100).toFixed(0)}% ({gaps} gaps)</span>
                  </div>
                  <Progress value={layerCoverage * 100} className="h-2" />
                </div>

                {/* Operations List */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Missing Operations</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {layer.operations.map((op, opIdx) => (
                      <div key={opIdx} className="text-xs p-2 bg-muted rounded border border-dashed">
                        <div className="flex items-start gap-2">
                          <Clock className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                          <span className="font-mono">{op}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                {gaps > 0 && (
                  <div className={`p-3 rounded-lg border text-sm ${
                    layer.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : layer.severity === 'high'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="font-semibold mb-1">Impact of {gaps} missing operations:</div>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      {layer.severity === 'critical' && (
                        <>
                          <li>Can't run 182+ formulas in required time</li>
                          <li>No real-time data integration</li>
                          <li>Can't scale beyond demo</li>
                        </>
                      )}
                      {layer.severity === 'high' && (
                        <>
                          <li>Hidden issues in production</li>
                          <li>No automated validation</li>
                          <li>Can't track which results are correct</li>
                        </>
                      )}
                      {layer.severity === 'medium' && (
                        <>
                          <li>Poor user experience</li>
                          <li>Manual intervention required</li>
                          <li>System not learning from data</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Implementation Roadmap */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Implementation Roadmap
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <div className="font-semibold text-sm">Phase 10.5 (Weeks 21-22): Critical Layers</div>
                <div className="text-sm text-muted-foreground">Layers 1 (Execution) + 7 (Data) + 5 (Observability)</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                →
              </div>
              <div>
                <div className="font-semibold text-sm">Phase 11.5 (Weeks 25-26): High Priority</div>
                <div className="text-sm text-muted-foreground">Layers 2 (State) + 3 (Orchestration) + 6 (Correctness)</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                →
              </div>
              <div>
                <div className="font-semibold text-sm">Phase 12+ (Weeks 26-29+): Remaining</div>
                <div className="text-sm text-muted-foreground">Layers 4 (Multi-tenancy) + 8 (Discovery) + 9 (Optimization) + 10 (Governance)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
