<template>
  <main class="user-summary-page">
    <section v-if="clusters.length">
      <h2>Clusters</h2>
      <ul class="cluster-list">
        <t class="cluster-entry" v-for="cluster in clusters" :key="cluster.uuid">
          <ClusterCard :uuid="cluster.uuid" :name="cluster.name" :microdevices="cluster.devices" />
        </t>
      </ul>
    </section>

    <p v-else>Loading clusters...</p>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import ClusterCard from '@/components/ClusterCard.vue'
import axios from 'axios'
import { getClusterMicrodevices, getClusters, type Microdevice } from '@/api/client'

interface Cluster {
  uuid: string
  name: string
  devices: Microdevice[]
}

// Reactive variables for credentials and clusters
const username = ref('foo') // Replace with user input in production
const password = ref('bar')
const clusters = ref<Cluster[]>([])

const login = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v1/login',
      {
        username: username.value,
        password: password.value,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      },
    )

    if (response.status === 200) {
      console.log('Login successful', response.data)
    } else {
      console.error('Login failed with status code', response.status)
    }
  } catch (error) {
    console.error('Login failed', error)
  }
}

const fetchDevices = async (clusters: Cluster[]) => {
  try {
    // Fetch devices for each cluster
    for (const cluster of clusters) {
      const res = await getClusterMicrodevices(cluster.uuid, true, true, true)

      if (res.ok) {
        cluster.devices = res.data
      } else {
        console.error('Failed to fetch devices for cluster', cluster.uuid)
        return []
      }
    }
  } catch (error) {
    console.error('Failed to fetch devices', error)
  }
}

// Trigger login and fetchClusters actions when the component is mounted
onMounted(async () => {
  await login()
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const res = await getClusters()
  clusters.value = res

  await fetchDevices(clusters.value) // Fetch devices after clusters are loaded
})
</script>

<style lang="scss" scoped>
.cluster-list {
  list-style-type: none;
  padding: 0;
}
</style>
