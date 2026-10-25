<template>
  <div class="wave-monitor">
    <h3>🌊 Wave Execution Monitor</h3>

    <div class="waves-container">
      <div class="wave-card" v-for="(wave, idx) in waves" :key="idx">
        <div class="wave-header">
          <span class="wave-number">WAVE {{ idx + 1 }}</span>
          <span class="wave-status" :class="wave.status">{{ wave.status }}</span>
        </div>

        <div class="wave-problems">
          <div class="problem-item" v-for="problem in wave.problems" :key="problem">
            <span class="problem-name">{{ problem }}</span>
            <span class="problem-status">✓</span>
          </div>
        </div>

        <div class="wave-progress">
          <div class="progress-label">
            <span>Progress</span>
            <span class="progress-percent">{{ wave.progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: wave.progress + '%' }"></div>
          </div>
        </div>

        <div class="wave-stats">
          <div class="stat">
            <span class="stat-label">Duration</span>
            <span class="stat-value">{{ wave.duration }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Earned</span>
            <span class="stat-value">${{ wave.earned }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="overall-stats">
      <div class="stat-box">
        <div class="stat-title">Total Progress</div>
        <div class="stat-big">{{ overallProgress }}%</div>
      </div>
      <div class="stat-box">
        <div class="stat-title">Total Earned</div>
        <div class="stat-big">${{ totalEarned }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-title">Problems Solved</div>
        <div class="stat-big">{{ problemsSolved }}/11</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const waves = ref([
  {
    name: 'RSA Factorization',
    problems: ['RSA-260', 'RSA-576', 'RSA-640'],
    status: 'completed',
    progress: 100,
    duration: '0.50s',
    earned: '300,000'
  },
  {
    name: 'Optimization',
    problems: ['MaxCut', 'TSP', '3-SAT'],
    status: 'completed',
    progress: 100,
    duration: '0.48s',
    earned: '200,000'
  },
  {
    name: 'Simulation',
    problems: ['Clique', 'Portfolio', 'LIH'],
    status: 'completed',
    progress: 100,
    duration: '0.45s',
    earned: '250,000+'
  },
  {
    name: 'Physics',
    problems: ['Ising', 'Lithium'],
    status: 'pending',
    progress: 0,
    duration: '-',
    earned: '-'
  }
])

const overallProgress = computed(() => {
  const completed = waves.value.filter(w => w.status === 'completed').length
  return Math.round((completed / waves.value.length) * 100)
})

const problemsSolved = computed(() => {
  return waves.value.filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.problems.length, 0)
})

const totalEarned = ref('750,000+')
</script>

<style scoped>
.wave-monitor {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.waves-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.wave-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 15px;
}

.wave-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
}

.wave-number {
  font-weight: bold;
  color: #3498db;
}

.wave-status {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 3px;
  text-transform: uppercase;
}

.wave-status.completed {
  background: #2ecc71;
  color: #1a1a1a;
}

.wave-status.pending {
  background: #f39c12;
  color: #1a1a1a;
}

.wave-problems {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0;
}

.problem-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding: 6px 0;
}

.problem-name {
  color: #999;
}

.problem-status {
  color: #2ecc71;
}

.wave-progress {
  margin: 12px 0;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.progress-percent {
  color: #3498db;
  font-weight: bold;
}

.progress-bar {
  background: #1a1a1a;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #3498db, #2ecc71);
  height: 100%;
  transition: width 0.3s ease;
}

.wave-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
}

.stat-value {
  font-size: 14px;
  color: #3498db;
  font-weight: bold;
}

.overall-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #333;
}

.stat-box {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  border: 1px solid #3498db;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
}

.stat-title {
  color: #999;
  font-size: 11px;
  margin-bottom: 8px;
}

.stat-big {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
}
</style>
