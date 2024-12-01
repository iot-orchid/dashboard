<template>
  <main class="user-summary-page">
    <section v-if="clusterStore.clusters.length">
      <div>
        <h3>Clusters</h3>
      </div>
      <ClustersSummary />
      <button class="create-cluster" @click.prevent="toggleCreateClusterForm">
        <span class="material-icons"> add_circle </span>
        <p>Create Cluster</p>
      </button>

      <!-- Work Area -->
      <div class="work-area">
        <ul>
          <div v-if="showCreateClusterForm">
            <CreateClusterForm />
          </div>
          <input
            class="cluster-search"
            type="text"
            v-model="clusterSearchQuery"
            placeholder="Search clusters"
          />
          <li
            v-for="cluster in clusterStore.clusters"
            :key="cluster.uuid"
            @click="selectCluster(cluster)"
            :class="{ selected: selectedCluster && selectedCluster.uuid === cluster.uuid }"
          >
            <p>{{ cluster.uuid }}</p>
            <h3>{{ cluster.name }}</h3>
          </li>
        </ul>
        <div class="cluster-graph">
          <div v-if="selectedCluster">
            <ClusterCard :uuid="selectedCluster.uuid" :name="selectedCluster.name" />
          </div>
          <div v-else>
            <p>Select a cluster to view its details</p>
          </div>
        </div>
      </div>
    </section>
    <p v-else>Loading clusters...</p>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ClusterCard from '@/components/ClusterCard.vue'
import { apiLogin, type Cluster } from '@/api/client'
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
const clusterSearchQuery = ref('')
const selectedCluster = ref<Cluster | null>(null)

const toggleCreateClusterForm = () => {
  showCreateClusterForm.value = !showCreateClusterForm.value
}

const selectCluster = (cluster: Cluster) => {
  selectedCluster.value = cluster
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

    &:hover {
      border-left: 5px solid var(--primary);
      cursor: pointer;
    }
  }
}

.selected {
  border-left: 5px solid var(--secondary);
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
  }

  .material-icons {
    color: white;
    font-size: 1.3rem;
  }

  &:hover {
    filter: brightness(0.9);
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
  padding: 2rem;
  max-width: 1200px; /* Limit the page width */
  margin: 0 auto; /* Center the page horizontally */
  box-sizing: border-box; /* Include padding in width calculation for consistency */
}

.cluster-search {
  padding: 0.5rem;
  border: 1px solid var(--grey);
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 1rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    outline: none;
  }
}
</style>
