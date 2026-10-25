<template>
  <div class="earnings-chart">
    <h3>💰 Earnings Overview</h3>
    
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="earnings-breakdown">
      <div class="earning-item" v-for="item in earnings" :key="item.name">
        <div class="earning-name">{{ item.name }}</div>
        <div class="earning-value">${{ (item.value / 1000).toFixed(0) }}K</div>
        <div class="earning-bar">
          <div class="earning-fill" :style="{ width: item.percentage + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="earnings-total">
      <span>Total Value Unlocked</span>
      <span class="total-value">${{ (totalValue / 1000000).toFixed(1) }}M</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const chartCanvas = ref(null)
let chartInstance = null

const earnings = ref([
  { name: 'Immediate Prizes', value: 500000 },
  { name: 'Research Grants', value: 825000 },
  { name: 'API Revenue (annual)', value: 100000 },
  { name: 'Cloud Financing', value: 500000 }
])

const totalValue = computed(() => {
  return earnings.value.reduce((sum, item) => sum + item.value, 0)
})

const earningsWithPercentage = computed(() => {
  const total = totalValue.value
  return earnings.value.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }))
})

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: earnings.value.map(e => e.name),
        datasets: [{
          data: earnings.value.map(e => e.value),
          backgroundColor: [
            '#3498db',
            '#2ecc71',
            '#f39c12',
            '#e74c3c'
          ],
          borderColor: '#1a1a1a',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#999',
              padding: 20
            }
          }
        }
      }
    })
  }
})
</script>

<style scoped>
.earnings-chart {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.chart-container {
  margin: 20px 0;
  max-height: 300px;
}

.earnings-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.earning-item {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 15px;
}

.earning-name {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.earning-value {
  font-size: 20px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 8px;
}

.earning-bar {
  background: #333;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.earning-fill {
  background: linear-gradient(90deg, #3498db, #2ecc71);
  height: 100%;
}

.earnings-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  border: 1px solid #3498db;
  border-radius: 6px;
  padding: 15px;
  margin-top: 20px;
  color: #999;
}

.total-value {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
}
</style>
