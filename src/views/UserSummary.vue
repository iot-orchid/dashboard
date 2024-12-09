<template>
  <main class="user-summary-page">
    <section v-if="clusterStore.clusters.length">
      <div>
        <h3 :class="appStore.colorMode">Cluster Summary</h3>
      </div>
      <ClustersSummary />
      <button class="create-cluster" @click.prevent="toggleCreateClusterForm">
        <span class="material-icons"> add_circle </span>
        <p>Create Cluster</p>
      </button>

      <!-- Work Area -->
      <div class="work-area">
        <ul>
          <transition name="fade-slide">
            <div v-if="showCreateClusterForm" class="form-container">
              <CreateClusterForm />
            </div>
          </transition>
          <input class="cluster-search" type="text" v-model="clusterSearchQuery" placeholder="Search clusters" />
          <li v-for="cluster in clusterStore.clusters" :key="cluster.uuid"
            :class="{ selected: selectedCluster && selectedCluster.uuid === cluster.uuid, [appStore.colorMode]: true }">
            <p class="cluster-uuid">
              {{ cluster.uuid }}
              <span @click.prevent="copyClusteUuid(cluster.uuid)"
                class="material-icons cluster-uuid-copy">content_copy</span>
            </p>
            <h3 @click="selectCluster(cluster)">{{ cluster.name }}</h3>
          </li>
        </ul>
        <div :class="{ 'cluster-graph': true, [appStore.colorMode]: true, [selectedCluster? '': 'empty']: true }">
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
import { useAppStore } from '@/store/AppStore'
// Reactive variables for credentials and clusters
const username = ref('foo')
const password = ref('bar')

// Pinia clusterStore instance
const clusterStore = useClusterStore()

// Pinia appStore instance
const appStore = useAppStore()

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

const copyClusteUuid = (uuid: string): void => {
  navigator.clipboard.writeText(uuid)
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
  position: relative;
  list-style: none;
  min-width: 20rem;

  li.dark {
    background-color: var(--dark-alt);
    color: white;
  }

  li {
    background-color: white;
  }

  li {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-5px);
      cursor: pointer;
    }
  }
}

.selected {
  border-left: 5px solid var(--secondary);

  &:hover {
    transform: none;
    cursor: pointer;
  }
}

.create-cluster {
  border-radius: 9999px;
  /* Makes it pill-shaped */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary);
  padding: 0.5rem 1rem;
  /* Add horizontal padding for pill shape */
  min-width: unset;
  /* Ensure width is defined by content */
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
  display: flex;
  flex: 1;
  margin-top: 1rem;
  height: 50vh;
  border-radius: 8px;
  padding: 1rem;
  max-width: 30rem;

  &.empty {
    justify-content: center;
    align-items: center;
  }

  &.dark {
    background-color: var(--dark-alt);
    color: white;
  }

  &.light {
    background: white;
    color: black;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

}

.user-summary-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.1s ease,
    transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(0px);
  /* Slide in/out effect */
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.form-container {
  position: absolute;

  margin-bottom: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cluster-uuid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;

  .cluster-uuid-copy {
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      color: var(--primary);
      transform: translateY(-1px);
    }
  }

}

h3.dark {
  color: white;
}

h3.light {
  color: black;
}

</style>
