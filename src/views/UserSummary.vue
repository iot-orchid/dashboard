<template>
  <main class="user-summary-page">
    <section v-if="clusters.length">
      <h2>Clusters</h2>
      <button> Create Cluster </button>
      <ul>
        <li v-for="cluster in clusters" :key="cluster.uuid">
          <ClusterCard :uuid="cluster.uuid" :name="cluster.name" :microdevices="cluster.devices" />
        </li>
      </ul>
    </section>

    <p v-else>Loading clusters...</p>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ClusterCard from '@/components/ClusterCard.vue'
import { apiLogin, getClusterMicrodevices, getClusters, type Microdevice } from '@/api/client'

interface Cluster {
  uuid: string
  name: string
  devices: Microdevice[]
}

// Reactive variables for credentials and clusters
const username = ref('foo')
const password = ref('bar')
const clusters = ref<Cluster[]>([])

// Trigger login and fetchClusters actions when the component is mounted
onMounted(async () => {
  {
    const res = await apiLogin(username.value, password.value)

    if (res.ok) {
      console.log('Logged in successfully')
    } else {
      console.error('Failed to login')
      return
    }
  }

  const res = await getClusters()

  if (res.ok == false) {
    console.error('Failed to fetch clusters')
    return
  }

  for (const cluster of res.data) {
    const res = await getClusterMicrodevices(cluster.uuid, true, true, true)

    if (res.ok == false) {
      console.error('Failed to fetch microdevices')
      return
    }

    clusters.value.push({
      uuid: cluster.uuid,
      name: cluster.name,
      devices: res.data,
    })
  }
})
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  max-width: 20rem;
  li {
    margin: 1rem 0;
    padding: 1rem;
    background-color: var(--light);
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

</style>
