/**
 * Formula Dashboard UI
 * Real-time visualization of formula network execution
 * Interactive formula control, input/output visualization, cross-domain bridges
 */

import React, { useState, useEffect, useCallback } from 'react'

interface FormulaNode {
  id: string
  domain: string
  name: string
  formula: string
  value: number
  lastUpdated: number
  inputs: string[]
  outputs: string[]
}

interface NetworkState {
  nodes: FormulaNode[]
  edges: Array<{ from: string; to: string; multiplier: number }>
  lastSync: number
  propagating: boolean
}

interface DomainColors {
  [key: string]: string
}

const DOMAIN_COLORS: DomainColors = {
  qsec: '#FF6B9D', // pink - quantum secure
  cross: '#4D96FF', // blue - cross-domain
  obs: '#00D9FF', // cyan - observability
  ml: '#FFB700', // amber - machine learning
  deploy: '#6BCB77', // green - deployment
  test: '#FF6B6B', // red - testing
  enterprise: '#9D4EDD', // purple - enterprise
  ui: '#FF006E', // hot pink - UI
  compress: '#00F5FF', // electric cyan - compression
  med: '#FB5607', // orange - medical
  autonomy: '#FFB703', // gold - autonomy
  other: '#CCCCCC' // gray
}

interface ExecutionTrace {
  nodeId: string
  value: number
  timestamp: number
  duration: number
}

export const FormulaDashboard: React.FC = () => {
  const [network, setNetwork] = useState<NetworkState | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [inputs, setInputs] = useState<Record<string, number>>({})
  const [results, setResults] = useState<Map<string, number>>(new Map())
  const [traces, setTraces] = useState<ExecutionTrace[]>([])
  const [view, setView] = useState<'graph' | 'domains' | 'dependencies'>('graph')
  const [autoRun, setAutoRun] = useState(true)

  // Fetch network from MCP
  useEffect(() => {
    const fetchNetwork = async () => {
      const response = await fetch('/api/mcp/formula-network')
      const data = await response.json()
      setNetwork(data)
    }
    fetchNetwork()
  }, [])

  // Auto-execute network
  useEffect(() => {
    if (!autoRun || !network) return

    const interval = setInterval(async () => {
      const response = await fetch('/api/mcp/execute-formula-network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })

      const { results: newResults, traces: newTraces } = await response.json()
      setResults(new Map(Object.entries(newResults)))
      setTraces(newTraces)
    }, 1000)

    return () => clearInterval(interval)
  }, [autoRun, network, inputs])

  const handleInputChange = useCallback((nodeId: string, value: number) => {
    setInputs(prev => ({ ...prev, [nodeId]: value }))
  }, [])

  const handleExecute = useCallback(async () => {
    const response = await fetch('/api/mcp/execute-formula-network', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputs)
    })

    const { results: newResults, traces: newTraces } = await response.json()
    setResults(new Map(Object.entries(newResults)))
    setTraces(newTraces)
  }, [inputs])

  if (!network) {
    return <div className="loading">Loading formula network...</div>
  }

  const selectedNodeData = network.nodes.find(n => n.id === selectedNode)
  const domainGroups = network.nodes.reduce((acc, node) => {
    if (!acc[node.domain]) acc[node.domain] = []
    acc[node.domain].push(node)
    return acc
  }, {} as Record<string, FormulaNode[]>)

  return (
    <div className="formula-dashboard">
      <header className="dashboard-header">
        <h1>🧮 Formula Network Dashboard</h1>
        <div className="controls">
          <button onClick={() => setView('graph')} className={view === 'graph' ? 'active' : ''}>
            📊 Graph
          </button>
          <button onClick={() => setView('domains')} className={view === 'domains' ? 'active' : ''}>
            🏗️ Domains
          </button>
          <button onClick={() => setView('dependencies')} className={view === 'dependencies' ? 'active' : ''}>
            🔗 Dependencies
          </button>
          <label>
            <input type="checkbox" checked={autoRun} onChange={e => setAutoRun(e.target.checked)} />
            Auto-run
          </label>
          <button onClick={handleExecute} className="execute-btn">
            ▶ Execute
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {view === 'graph' && (
          <div className="graph-view">
            <div className="formula-network">
              <svg viewBox="0 0 1400 900" className="network-svg">
                {/* Draw edges */}
                {network.edges.map((edge, idx) => {
                  const fromNode = network.nodes.find(n => n.id === edge.from)
                  const toNode = network.nodes.find(n => n.id === edge.to)
                  if (!fromNode || !toNode) return null

                  const fromPos = getNodePosition(edge.from)
                  const toPos = getNodePosition(edge.to)

                  return (
                    <line
                      key={idx}
                      x1={fromPos.x}
                      y1={fromPos.y}
                      x2={toPos.x}
                      y2={toPos.y}
                      className="formula-edge"
                      strokeWidth="2"
                      stroke="#ccc"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })}

                {/* Define arrow marker */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#999" />
                  </marker>
                </defs>

                {/* Draw nodes */}
                {network.nodes.map(node => {
                  const pos = getNodePosition(node.id)
                  const value = results.get(node.id) || 0
                  const isSelected = selectedNode === node.id
                  const color = DOMAIN_COLORS[node.domain] || DOMAIN_COLORS.other

                  return (
                    <g
                      key={node.id}
                      className={`formula-node ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="30"
                        fill={color}
                        opacity={Math.max(0.3, Math.min(1, value / 100))}
                        stroke={isSelected ? '#000' : '#999'}
                        strokeWidth={isSelected ? 3 : 1}
                      />
                      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold">
                        {node.name}
                      </text>
                      <title>{node.formula}</title>
                    </g>
                  )
                })}
              </svg>
            </div>

            {selectedNodeData && (
              <div className="node-details">
                <h3>{selectedNodeData.name}</h3>
                <div className="details-grid">
                  <div>
                    <strong>ID:</strong> {selectedNodeData.id}
                  </div>
                  <div>
                    <strong>Domain:</strong> {selectedNodeData.domain}
                  </div>
                  <div>
                    <strong>Formula:</strong> {selectedNodeData.formula}
                  </div>
                  <div>
                    <strong>Current Value:</strong> {(results.get(selectedNodeData.id) || 0).toFixed(4)}
                  </div>

                  {selectedNodeData.inputs.length > 0 && (
                    <div className="inputs-section">
                      <strong>Inputs:</strong>
                      <ul>
                        {selectedNodeData.inputs.map(inputId => (
                          <li key={inputId}>
                            {inputId} = {(results.get(inputId) || 0).toFixed(4)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedNodeData.outputs.length > 0 && (
                    <div className="outputs-section">
                      <strong>Outputs:</strong>
                      <ul>
                        {selectedNodeData.outputs.map(outputId => (
                          <li key={outputId}>
                            {outputId} → {(results.get(outputId) || 0).toFixed(4)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'domains' && (
          <div className="domains-view">
            {Object.entries(domainGroups).map(([domain, nodes]) => (
              <div key={domain} className="domain-group">
                <h3 style={{ color: DOMAIN_COLORS[domain] }}>
                  {domain.toUpperCase()} ({nodes.length} formulas)
                </h3>
                <div className="domain-formulas">
                  {nodes.map(node => (
                    <div
                      key={node.id}
                      className="formula-card"
                      onClick={() => {
                        setView('graph')
                        setSelectedNode(node.id)
                      }}
                    >
                      <div className="formula-name">{node.name}</div>
                      <div className="formula-value">{(results.get(node.id) || 0).toFixed(3)}</div>
                      <div className="formula-expr">{node.formula}</div>
                      <div className="formula-meta">
                        Inputs: {node.inputs.length} | Outputs: {node.outputs.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'dependencies' && selectedNodeData && (
          <div className="dependencies-view">
            <h3>Dependency Chain for {selectedNodeData.name}</h3>
            <div className="dependency-tree">
              <DependencyTree nodeId={selectedNodeData.id} network={network} results={results} depth={0} />
            </div>
          </div>
        )}
      </div>

      <footer className="execution-trace">
        <h4>⏱️ Recent Execution ({traces.length})</h4>
        <div className="trace-list">
          {traces.slice(-10).map((trace, idx) => (
            <div key={idx} className="trace-entry">
              <span className="trace-node">{trace.nodeId}</span>
              <span className="trace-value">{trace.value.toFixed(4)}</span>
              <span className="trace-duration">{trace.duration.toFixed(2)}ms</span>
            </div>
          ))}
        </div>
      </footer>

      <style>{`
        .formula-dashboard {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f5f5f5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-header {
          padding: 20px;
          background: white;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: 24px;
        }

        .controls {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .controls button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 14px;
        }

        .controls button.active,
        .controls button:hover {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .execute-btn {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .execute-btn:hover {
          background: #218838;
        }

        .dashboard-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .graph-view {
          flex: 1;
          display: flex;
          gap: 20px;
          padding: 20px;
          overflow: auto;
        }

        .formula-network {
          flex: 2;
          background: white;
          border-radius: 8px;
          overflow: auto;
        }

        .network-svg {
          width: 100%;
          height: 100%;
          min-height: 600px;
        }

        .formula-node {
          cursor: pointer;
        }

        .formula-node text {
          pointer-events: none;
        }

        .node-details {
          flex: 1;
          background: white;
          border-radius: 8px;
          padding: 20px;
          overflow-y: auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .domains-view {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .domain-group {
          margin-bottom: 24px;
        }

        .domain-formulas {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .formula-card {
          background: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .formula-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .formula-name {
          font-weight: bold;
          margin-bottom: 4px;
        }

        .formula-value {
          font-size: 18px;
          color: #007bff;
          font-weight: bold;
        }

        .formula-expr {
          font-size: 11px;
          color: #666;
          margin: 4px 0;
          word-break: break-all;
        }

        .formula-meta {
          font-size: 10px;
          color: #999;
          margin-top: 4px;
        }

        .execution-trace {
          padding: 12px 20px;
          background: white;
          border-top: 1px solid #ddd;
          max-height: 150px;
          overflow-y: auto;
        }

        .trace-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 8px;
          margin-top: 8px;
        }

        .trace-entry {
          display: flex;
          gap: 12px;
          padding: 8px;
          background: #f9f9f9;
          border-radius: 4px;
          font-size: 12px;
          font-family: monospace;
        }

        .trace-node {
          font-weight: bold;
          min-width: 100px;
        }

        .trace-value {
          color: #007bff;
          min-width: 80px;
        }

        .trace-duration {
          color: #999;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  )
}

/**
 * Helper: calculate node position in network graph
 */
function getNodePosition(nodeId: string): { x: number; y: number } {
  const domainOrder: Record<string, number> = {
    qsec: 0,
    cross: 1,
    obs: 2,
    ml: 3,
    deploy: 4,
    test: 5,
    enterprise: 6,
    ui: 7,
    compress: 8,
    med: 9,
    autonomy: 10
  }

  const domain = nodeId.split('-')[0] === 'q' ? 'qsec' : nodeId.split('-')[0]
  const domainIdx = domainOrder[domain] || 0
  const hash = nodeId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)

  return {
    x: 100 + domainIdx * 120,
    y: 100 + (hash % 7) * 120
  }
}

/**
 * Dependency tree visualization
 */
function DependencyTree({
  nodeId,
  network,
  results,
  depth
}: {
  nodeId: string
  network: NetworkState
  results: Map<string, number>
  depth: number
}) {
  const node = network.nodes.find(n => n.id === nodeId)
  if (!node || depth > 5) return null

  return (
    <div className="tree-node" style={{ marginLeft: `${depth * 20}px` }}>
      <div className="tree-item">
        <strong>{node.name}</strong> = {(results.get(nodeId) || 0).toFixed(4)}
      </div>
      {node.inputs.map(inputId => (
        <DependencyTree
          key={inputId}
          nodeId={inputId}
          network={network}
          results={results}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export default FormulaDashboard
