/**
 * Phase 12d: Reinforcement Learning
 * Use reward signals to guide optimization strategy
 */

export interface Action {
  id: string
  name: string
  component: string
  expectedReward: number
}

export interface State {
  latency: number
  throughput: number
  errorRate: number
  resourceUsage: number
  timestamp: number
}

export interface Transition {
  state: State
  action: Action
  nextState: State
  reward: number
  timestamp: number
}

export interface QValue {
  stateAction: string
  value: number
  visitCount: number
}

export class ReinforcementLearner {
  private qTable: Map<string, number> = new Map()
  private transitions: Transition[] = []
  private epsilon = 0.1 // Exploration rate
  private alpha = 0.1 // Learning rate
  private gamma = 0.9 // Discount factor
  private totalReward = 0
  private cumulativeReward: number[] = []

  /**
   * Get available actions for current state
   */
  getActions(state: State): Action[] {
    const actions: Action[] = []

    // Latency optimization
    if (state.latency > 100) {
      actions.push({
        id: 'action-optimize-latency',
        name: 'Optimize latency',
        component: 'core-engine',
        expectedReward: Math.max(10, 50 - state.latency / 5),
      })
    }

    // Throughput improvement
    if (state.throughput < 1000) {
      actions.push({
        id: 'action-improve-throughput',
        name: 'Improve throughput',
        component: 'concurrency',
        expectedReward: (1000 - state.throughput) / 50,
      })
    }

    // Error handling
    if (state.errorRate > 0.01) {
      actions.push({
        id: 'action-reduce-errors',
        name: 'Reduce error rate',
        component: 'error-handling',
        expectedReward: Math.min(30, state.errorRate * 1000),
      })
    }

    // Resource optimization
    if (state.resourceUsage > 0.7) {
      actions.push({
        id: 'action-optimize-resources',
        name: 'Optimize resources',
        component: 'resource-manager',
        expectedReward: (state.resourceUsage - 0.5) * 20,
      })
    }

    return actions
  }

  /**
   * Select action using epsilon-greedy strategy
   */
  selectAction(state: State, actions: Action[]): Action {
    // Explore with probability epsilon
    if (Math.random() < this.epsilon) {
      return actions[Math.floor(Math.random() * actions.length)]
    }

    // Exploit: choose action with highest Q-value
    let bestAction = actions[0]
    let bestValue = this.getQValue(state, actions[0])

    for (const action of actions.slice(1)) {
      const value = this.getQValue(state, action)
      if (value > bestValue) {
        bestValue = value
        bestAction = action
      }
    }

    return bestAction
  }

  /**
   * Execute action and get reward
   */
  async executeAction(state: State, action: Action): Promise<{ nextState: State; reward: number }> {
    // Simulate action execution
    const nextState: State = {
      latency: Math.max(0, state.latency - (action.id.includes('latency') ? 20 : 0)),
      throughput: Math.min(2000, state.throughput + (action.id.includes('throughput') ? 150 : 0)),
      errorRate: Math.max(0, state.errorRate - (action.id.includes('error') ? 0.005 : 0)),
      resourceUsage: Math.max(0.2, state.resourceUsage - (action.id.includes('resource') ? 0.1 : 0)),
      timestamp: Date.now(),
    }

    // Calculate reward
    const reward = this.calculateReward(state, nextState)

    // Record transition
    this.transitions.push({
      state,
      action,
      nextState,
      reward,
      timestamp: Date.now(),
    })

    // Update Q-value
    this.updateQValue(state, action, nextState, reward)

    this.totalReward += reward
    this.cumulativeReward.push(this.totalReward)

    return { nextState, reward }
  }

  /**
   * Calculate reward from state transition
   */
  private calculateReward(prevState: State, newState: State): number {
    let reward = 0

    // Latency improvement
    if (newState.latency < prevState.latency) {
      reward += (prevState.latency - newState.latency) / 10
    }

    // Throughput improvement
    if (newState.throughput > prevState.throughput) {
      reward += (newState.throughput - prevState.throughput) / 50
    }

    // Error reduction
    if (newState.errorRate < prevState.errorRate) {
      reward += (prevState.errorRate - newState.errorRate) * 100
    }

    // Resource efficiency
    if (newState.resourceUsage < prevState.resourceUsage) {
      reward += (prevState.resourceUsage - newState.resourceUsage) * 10
    }

    // Penalty for overcorrection
    if (newState.latency < 10 || newState.throughput > 1800) {
      reward -= 2
    }

    return reward
  }

  /**
   * Get Q-value for state-action pair
   */
  private getQValue(state: State, action: Action): number {
    const key = `${this.stateKey(state)}-${action.id}`
    return this.qTable.get(key) || 0
  }

  /**
   * Update Q-value using Q-learning
   */
  private updateQValue(state: State, action: Action, nextState: State, reward: number): void {
    const key = `${this.stateKey(state)}-${action.id}`
    const currentQ = this.getQValue(state, action)

    // Get max Q value for next state
    const nextActions = this.getActions(nextState)
    let maxNextQ = 0
    for (const nextAction of nextActions) {
      maxNextQ = Math.max(maxNextQ, this.getQValue(nextState, nextAction))
    }

    // Q-learning update: Q(s,a) = Q(s,a) + α[r + γ*max(Q(s',a')) - Q(s,a)]
    const newQ = currentQ + this.alpha * (reward + this.gamma * maxNextQ - currentQ)
    this.qTable.set(key, newQ)
  }

  /**
   * Create state key for Q-table
   */
  private stateKey(state: State): string {
    return `${Math.round(state.latency)}-${Math.round(state.throughput)}-${Math.round(state.errorRate * 1000)}-${Math.round(state.resourceUsage * 10)}`
  }

  /**
   * Get learning statistics
   */
  getStats(): {
    totalEpisodes: number
    totalReward: number
    averageReward: number
    qTableSize: number
    explorationRate: number
  } {
    return {
      totalEpisodes: this.transitions.length,
      totalReward: this.totalReward,
      averageReward: this.transitions.length > 0 ? this.totalReward / this.transitions.length : 0,
      qTableSize: this.qTable.size,
      explorationRate: this.epsilon,
    }
  }

  /**
   * Get reward trend
   */
  getRewardTrend(): number[] {
    return this.cumulativeReward.slice(-100)
  }

  /**
   * Decay epsilon (reduce exploration over time)
   */
  decayEpsilon(): void {
    this.epsilon = Math.max(0.01, this.epsilon * 0.99)
  }
}

export default ReinforcementLearner
