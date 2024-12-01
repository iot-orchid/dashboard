<template>
  <div class="create-cluster-form">
    <input type="text" v-model="clusterName" placeholder="Cluster name" />
    <select v-model="clusterRegion">
      <option value="" disabled selected>Select a region</option>
      <option v-for="region in clusterStore.getRegions()" :key="region" :value="region">
        {{ region }}
      </option>
    </select>
    <input v-model="clusterDescription" type="text" placeholder="Description" />
    <button @click="createCluster">Create Cluster</button>
    <div class="uuid-note">
      <span class="material-icons">error</span>
      <p>The cluster's UUID will be auto generated</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useClusterStore } from '@/store/ClusterStore'
import { useToast } from 'vue-toastification';

const clusterStore = useClusterStore()

const clusterName = ref('')
const clusterRegion = ref('')
const clusterDescription = ref('')

const toast = useToast()

const createCluster = async () => {

  const res = await clusterStore.createCluster(clusterName.value, clusterRegion.value, clusterDescription.value)

  if (!res.ok) {
    console.error('Failed to create cluster')
    toast.error(`Failed to create cluster: ${res.error}`)
    return
  }

  toast.success(`Cluster "${clusterName.value}" created successfully`)
  clusterName.value = ''
  clusterRegion.value = ''
  clusterDescription.value = ''
}
</script>

<style lang="scss">
.create-cluster-form {
  display: flex;
  flex-direction: column; /* Use column for a more responsive layout */
  gap: 1.5rem; /* Increase spacing for better aesthetics */
  margin-bottom: 2rem;
  max-width: 20rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .uuid-note {
    display: flex;
    align-items: center;
    gap: 0.75rem; /* Slightly increased for better spacing */
    font-size: 0.875rem; /* More readable text */
    color: #333; /* Subtle text color */
    background-color: #fff8db; /* Softer yellow for a modern look */
    padding: 1rem; /* Spacious padding for better proportions */
    border-radius: 12px; /* Softer corners for modern aesthetics */
    border: 1px solid #ffe08a; /* Add a subtle border */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  }

  input {
    padding: 0.75rem; /* Slightly larger padding for a modern feel */
    border: 1px solid var(--grey);
    border-radius: 8px; /* Softer corners */
    font-size: 1rem; /* Modern, readable font size */
    transition:
      border-color 0.3s,
      box-shadow 0.3s; /* Smooth interactions */
  }

  input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); /* Subtle focus effect */
    outline: none;
  }

  button {
    padding: 0.75rem 1.25rem; /* Balanced button size */
    background-color: var(--primary);
    color: white; /* Ensure text visibility */
    border: none;
    border-radius: 8px; /* Match input's border radius */
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition:
      background-color 0.3s,
      transform 0.2s; /* Smooth hover effect */
  }

  button:hover {
    background-color: var(--secondary); /* Slightly darker for hover */
    transform: translateY(-2px); /* Subtle lift effect */
  }

  button:active {
    transform: translateY(0); /* Remove lift effect */
  }

  select {
    padding: 0.75rem;
    border: 1px solid var(--grey);
    border-radius: 8px;
    font-size: 1rem;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;
  }
}
</style>
