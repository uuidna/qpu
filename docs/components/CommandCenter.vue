<template>
  <div class="command-center">
    <h3>Execute Commands</h3>
    
    <div class="command-buttons">
      <!-- Wave Execution -->
      <div class="command-group">
        <h4>🌊 Wave System</h4>
        <button 
          @click="execute('wave:all')"
          :disabled="loading"
          class="btn btn-primary"
        >
          Execute All Waves
        </button>
        <button 
          @click="execute('wave:discover')"
          :disabled="loading"
          class="btn btn-secondary"
        >
          Discover Opportunities
        </button>
        <button 
          @click="execute('wave:status')"
          :disabled="loading"
          class="btn btn-secondary"
        >
          Check Status
        </button>
      </div>

      <!-- Prize Operations -->
      <div class="command-group">
        <h4>💰 Prize Operations</h4>
        <button 
          @click="execute('prize-hunt:all')"
          :disabled="loading"
          class="btn btn-secondary"
        >
          Hunt All Prizes
        </button>
        <button 
          @click="execute('execute-prizes:all')"
          :disabled="loading"
          class="btn btn-secondary"
        >
          Execute Prizes
        </button>
        <button 
          @click="execute('execute-prizes:earnings')"
          :disabled="loading"
          class="btn btn-secondary"
        >
          View Earnings
        </button>
      </div>

      <!-- Problem Solving -->
      <div class="command-group">
        <h4>🧩 Problem Solving</h4>
        <button 
          @click="execute('autonomous:all')"
          :disabled="loading"
          class="btn btn-secondary"
        >
          Solve Everything
        </button>
        <button 
          @click="execute('autonomous --all')"
          :disabled="loading"
          class="btn btn-secondary"
        >
          Autonomous Mode
        </button>
      </div>
    </div>

    <div class="status" v-if="loading">
      ⏳ Executing...
    </div>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean
})

const emit = defineEmits(['execute'])

function execute(command) {
  emit('execute', command)
}
</script>

<style scoped>
.command-center {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.command-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.command-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.command-group h4 {
  margin: 0 0 10px 0;
  color: #64d5ff;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-secondary {
  background: #555;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #666;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status {
  margin-top: 15px;
  padding: 10px;
  background: #2a2a2a;
  border-left: 3px solid #64d5ff;
  border-radius: 4px;
  color: #64d5ff;
}
</style>
