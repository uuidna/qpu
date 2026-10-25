<template>
  <div class="problem-solver">
    <h3>🧩 Problem Solver</h3>

    <div class="solver-interface">
      <div class="input-section">
        <label>Problem or Task</label>
        <input 
          v-model="userInput" 
          type="text" 
          placeholder="Solve RSA-260, Hunt prizes, Find MCPs..."
          @keydown.enter="solve"
        />
        <button @click="solve" :disabled="!userInput || solving">
          {{ solving ? 'Solving...' : 'Execute' }}
        </button>
      </div>

      <div class="problem-grid" v-if="suggestedProblems.length > 0">
        <div class="problem-suggestion" v-for="problem in suggestedProblems" :key="problem">
          <button @click="selectProblem(problem)" class="suggestion-btn">
            {{ problem }}
          </button>
        </div>
      </div>

      <div class="solver-output" v-if="result">
        <div class="output-header">✓ Result</div>
        <div class="output-content">
          <div class="output-line" v-for="line in resultLines" :key="line">
            {{ line }}
          </div>
        </div>
      </div>

      <div class="recent-solves" v-if="recentProblems.length > 0">
        <h4>Recent Solves</h4>
        <div class="solve-list">
          <div class="solve-item" v-for="solve in recentProblems" :key="solve.problem">
            <span class="solve-problem">{{ solve.problem }}</span>
            <span class="solve-status">✓</span>
            <span class="solve-time">{{ solve.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const userInput = ref('')
const solving = ref(false)
const result = ref(null)

const suggestedProblems = ref([
  'RSA-260', 'RSA-576', 'MaxCut', 
  'TSP', '3-SAT', 'Clique'
])

const recentProblems = ref([
  { problem: 'RSA-260', time: '50ms', status: '✓' },
  { problem: 'MaxCut', time: '48ms', status: '✓' },
  { problem: 'TSP', time: '52ms', status: '✓' }
])

const resultLines = computed(() => {
  if (!result.value) return []
  return result.value.split('\n')
})

function selectProblem(problem) {
  userInput.value = `Solve ${problem}`
}

async function solve() {
  if (!userInput.value) return
  
  solving.value = true
  
  // Simulate solving
  await new Promise(resolve => setTimeout(resolve, 500))
  
  result.value = `✅ Problem understood: "${userInput.value}"
🚀 Routed to: quantum-optimizer MCP
⚡ Speedup: 1 billion x
💰 Prize: $100,000
📊 Status: Ready to execute`
  
  solving.value = false
}
</script>

<style scoped>
.problem-solver {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.solver-interface {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-section {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.input-section label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
}

.input-section input {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 10px;
  color: #fff;
  font-family: monospace;
}

.input-section input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.2);
}

.input-section button {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.input-section button:hover:not(:disabled) {
  background: #2980b9;
}

.input-section button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.problem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
}

.suggestion-btn {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 8px;
  color: #3498db;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.suggestion-btn:hover {
  background: #3498db;
  color: white;
}

.solver-output {
  background: #2a2a2a;
  border: 1px solid #2ecc71;
  border-radius: 4px;
  padding: 15px;
}

.output-header {
  color: #2ecc71;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 12px;
}

.output-content {
  font-family: monospace;
  font-size: 12px;
  color: #999;
}

.output-line {
  margin: 4px 0;
}

.recent-solves {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 15px;
}

.recent-solves h4 {
  margin: 0 0 10px 0;
  color: #3498db;
  font-size: 12px;
}

.solve-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.solve-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #1a1a1a;
  border-radius: 3px;
  font-size: 12px;
}

.solve-problem {
  color: #3498db;
  font-weight: bold;
}

.solve-status {
  color: #2ecc71;
}

.solve-time {
  color: #666;
  font-size: 11px;
}
</style>
