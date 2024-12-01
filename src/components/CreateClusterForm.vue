<template>
  <div class="container">
    <h4>Create New Cluster</h4>
    <form class="create-cluster-form" @submit.prevent="createCluster">
      <input
        type="text"
        v-model="clusterName"
        placeholder="Cluster name"
        :class="{ 'input-error': !isValidName && touchedName }"
        @blur="touchedName = true"
      />
      <p v-if="!isValidName && touchedName" class="error-message">Cluster name is required.</p>

      <select
        v-model="clusterRegion"
        :class="{ 'input-error': !isValidRegion && touchedRegion }"
        @blur="touchedRegion = true"
      >
        <option value="" disabled selected>Select a region</option>
        <option v-for="region in clusterStore.getRegions()" :key="region" :value="region">
          {{ region }}
        </option>
      </select>
      <p v-if="!isValidRegion && touchedRegion" class="error-message">Region is required.</p>

      <textarea v-model="clusterDescription" type="text" placeholder="Description"></textarea>
    </form>
    <button class="submit-btn" @click="createCluster">Create Cluster</button>
    <div class="uuid-note">
      <span class="material-icons">error</span>
      <p>The cluster's UUID will be auto generated</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useClusterStore } from '@/store/ClusterStore'
import { useToast } from 'vue-toastification'

const clusterStore = useClusterStore()

const clusterName = ref('')
const clusterRegion = ref('')
const clusterDescription = ref('')

// Track whether the fields have been touched
const touchedName = ref(false)
const touchedRegion = ref(false)

const toast = useToast()

const isValidName = computed(() => clusterName.value.trim().length > 0)
const isValidRegion = computed(() => clusterRegion.value.trim().length > 0)

const createCluster = async () => {
  // Mark fields as touched to show errors if not valid
  touchedName.value = true
  touchedRegion.value = true

  if (!isValidName.value || !isValidRegion.value) {
    toast.error('Please fill in all required fields.')
    return
  }

  const res = await clusterStore.createCluster(
    clusterName.value,
    clusterRegion.value,
    clusterDescription.value,
  )

  if (!res.ok) {
    console.error('Failed to create cluster')
    toast.error(`Failed to create cluster: ${res.error}`)
    return
  }

  toast.success(`Cluster "${clusterName.value}" created successfully`)
  clusterName.value = ''
  clusterRegion.value = ''
  clusterDescription.value = ''
  touchedName.value = false
  touchedRegion.value = false
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  margin-top: 1rem;
}

.uuid-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: smaller;
  background-color: goldenrod;
  border: 2px solid gray;

  opacity: 0.8;

  color: rgba(78, 72, 72, 0.966);
  padding: 0.5rem;
  border-radius: 1rem;
}

.submit-btn {
  border-radius: 1rem;
  background-color: var(--secondary);
  padding: 0.5rem 1rem; /* Add horizontal padding for pill shape */
  min-width: unset;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: var(--primary);
    filter: brightness(0.9);
  }
}

.create-cluster-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input,
select,
textarea {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
}

textarea {
  resize: vertical;
  height: 5rem;
  max-height: 10rem;

  &:focus {
    height: 20rem;
  }
}

.input-error {
  border-color: red;
  box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: -0.2rem;
  margin-bottom: 0.5rem;
}
</style>
