import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react'

export interface OperationCardProps {
  id: string
  name: string
  domain: string
  description: string
  status: 'verified' | 'testing' | 'pending'
  accuracy: number
  coinsGenerated: number
  liveAPIs?: Array<{ name: string; status: string; accuracy?: number }>
}

export const OperationCard: React.FC<OperationCardProps> = ({
  id,
  name,
  domain,
  description,
  status,
  accuracy,
  coinsGenerated,
  liveAPIs = []
}) => {
  const statusConfig = {
    verified: { color: 'bg-green-500', icon: CheckCircle2, label: 'Verified' },
    testing: { color: 'bg-yellow-500', icon: AlertCircle, label: 'Testing' },
    pending: { color: 'bg-gray-500', icon: Clock, label: 'Pending' }
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <CardDescription className="text-sm mt-1">{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-2">{domain}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{config.label}</span>
        </div>

        {/* Accuracy Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Accuracy</span>
            <span className="text-muted-foreground">{(accuracy * 100).toFixed(1)}%</span>
          </div>
          <Progress value={accuracy * 100} className="h-2" />
        </div>

        {/* Coins Generated */}
        <div className="flex items-center gap-2 text-sm">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">Coins:</span>
          <span className="text-muted-foreground">{coinsGenerated.toLocaleString()}</span>
        </div>

        {/* Live APIs */}
        {liveAPIs.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-2">Connected APIs</span>
            <div className="space-y-1">
              {liveAPIs.map((api, idx) => (
                <div key={idx} className="text-xs flex items-center justify-between p-2 bg-muted rounded">
                  <span>{api.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {api.status}
                    {api.accuracy && ` ${(api.accuracy * 100).toFixed(0)}%`}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ID Footer */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          ID: {id}
        </div>
      </CardContent>
    </Card>
  )
}
