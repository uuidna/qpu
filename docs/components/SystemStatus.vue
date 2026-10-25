<template>
  <div class="system-status">
    <div class="status-grid">
      <div class="status-card">
        <div class="label">Problems Available</div>
        <div class="value">{{ data.problems }}</div>
        <div class="sublabel">Solvable</div>
      </div>

      <div class="status-card">
        <div class="label">Currently Solving</div>
        <div class="value">{{ data.solved }}/{{ data.problems }}</div>
        <div class="sublabel">Progress</div>
      </div>

      <div class="status-card">
        <div class="label">Total Earned</div>
        <div class="value">${{ (data.totalEarned / 1000000).toFixed(1) }}M</div>
        <div class="sublabel">Prizes Won</div>
      </div>

      <div class="status-card">
        <div class="label">System Uptime</div>
        <div class="value">{{ data.uptime }}</div>
        <div class="sublabel">Operational</div>
      </div>
    </div>

    <div class="status-bar">
      <div class="progress-container">
        <label>Execution Progress</label>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-text">{{ progressPercent }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: Object
})

const progressPercent = computed(() => {
  if (props.data.problems === 0) return 0
  return Math.round((props.data.solved / props.data.problems) * 100)
})
</script>

<style scoped>
.system-status {
  margin: 20px 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.status-card {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border: 1px solid #3498db;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.label {
  color: #999;
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.value {
  color: #3498db;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.sublabel {
  color: #666;
  font-size: 11px;
}

.status-bar {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 15px;
}

.progress-container label {
  display: block;
  margin-bottom: 10px;
  color: #999;
  font-size: 12px;
}

.progress-bar {
  background: #333;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  background: linear-gradient(90deg, #3498db, #2ecc71);
  height: 100%;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  color: #3498db;
  font-size: 12px;
}
</style>
