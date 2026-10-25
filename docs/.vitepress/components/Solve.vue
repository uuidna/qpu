<template>
  <div class="qpu-solve">
    <div class="input-section">
      <textarea
        v-model="problem"
        placeholder="Describe your problem..."
        rows="2"
      ></textarea>
      <button @click="solve" :disabled="!problem || loading" class="btn">
        {{ loading ? 'Solving...' : 'Solve' }}
      </button>
    </div>

    <div v-if="result" class="result-section">
      <div class="result-item">
        <span class="label">Solver:</span>
        <span class="value">{{ result.solver }}</span>
      </div>
      <div v-if="result.capabilities" class="capabilities">
        <span class="label">Capabilities:</span>
        <span v-for="cap in result.capabilities" :key="cap" class="tag">{{ cap }}</span>
      </div>
    </div>

    <div v-if="error" class="error">❌ {{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const problem = ref('')
const result = ref(null)
const error = ref('')
const loading = ref(false)

const solve = async () => {
  loading.value = true
  error.value = ''
  result.value = null

  try {
    await new Promise(r => setTimeout(r, 800))
    result.value = {
      solver: 'optimal-router',
      capabilities: ['scale-free', 'unlimited-network', 'clay-verified']
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.qpu-solve {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: monospace;
  font-size: 13px;
  resize: vertical;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.btn:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
}

.result-section {
  margin-top: 12px;
  padding: 12px;
  background: var(--vp-c-bg);
  border-radius: 4px;
}

.result-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 70px;
}

.value {
  font-family: monospace;
  color: var(--vp-c-text-1);
}

.capabilities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-radius: 3px;
  font-size: 11px;
}

.error {
  margin-top: 12px;
  padding: 8px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger);
  border-radius: 4px;
  font-size: 12px;
}
</style>
