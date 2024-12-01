<template>
  <main class="user-summary-page">
    <section v-if="clusterStore.clusters.length">
      <h2>Clusters</h2>
      <ClustersSummary />
      <button class="create-cluster" @click.prevent="toggleCreateClusterForm">
        <span class="material-icons"> add_circle </span>
        <p>Create Cluster</p>
      </button>
      <div v-if="showCreateClusterForm">
        <CreateClusterForm />
      </div>

      <!-- Work Area -->
      <div class="work-area">
        <ul>
          <li class="cluster-card" v-for="cluster in clusterStore.clusters" :key="cluster.uuid">
            <ClusterCard :uuid="cluster.uuid" :name="cluster.name" />
          </li>
        </ul>
        <div class="cluster-graph">
          <h2>Hello World</h2>
        </div>
      </div>
    </section>
    <p v-else>Loading clusters...</p>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ClusterCard from '@/components/ClusterCard.vue'
import { apiLogin } from '@/api/client'
import { useClusterStore } from '@/store/ClusterStore'
import ClustersSummary from '@/components/ClusterSummary.vue'
import CreateClusterForm from '@/components/CreateClusterForm.vue'
// Reactive variables for credentials and clusters
const username = ref('foo')
const password = ref('bar')

// Pinia clusterStore instance
const clusterStore = useClusterStore()

// Reactive variable to toggle the create cluster form
const showCreateClusterForm = ref(false)

const toggleCreateClusterForm = () => {
  showCreateClusterForm.value = !showCreateClusterForm.value
}

// Trigger login and fetchClusters actions when the component is mounted
onMounted(async () => {
  {
    const res = await apiLogin(username.value, password.value)

    if (!res.ok) {
      console.error('Failed to login')
      return
    }

    console.log('Logged in')
  }

  const res = await clusterStore.getClusters()

  if (!res.ok) {
    console.error('Failed to fetch clusters')
    return
  }

  console.log('Fetched clusters')
})
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  min-width: 20rem;
  li {
    margin: 1rem 0;
    padding: 1rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    :deep(.cluster-details) {
      display: none;
    }

    &:hover {
      border-top: 5px solid var(--primary);

      :deep(.cluster-details) {
        display: block;
      }
    }
  }
}

.create-cluster {
  border-radius: 9999px; /* Makes it pill-shaped */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary);
  padding: 0.5rem 1rem; /* Add horizontal padding for pill shape */
  min-width: unset; /* Ensure width is defined by content */
  color: white;
  p {
    margin-left: 0.5rem;
    display: none;
  }

  .material-icons {
    color: white;
    font-size: 1.3rem;
  }

  &:hover {
    p {
      display: block;
    }
  }
}

.work-area {
  display: flex;
  align-content: flex-end;
  gap: 2rem;
}

.cluster-graph {
  margin-top: 1rem;
  width: 100%;
  height: 30rem;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-summary-page {
  padding: 4rem;
}
</style>
