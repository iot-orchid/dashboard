<template>
  <main class="user-summary-page">
    <h1>Summary</h1>
    <p>This is the about page</p>

    <section v-if="clusters.length">
      <h2>Clusters</h2>
      <ul class="cluster-list">
        <li class="cluster-entry" v-for="cluster in clusters" :key="cluster.uuid">
          <p class="cluster-uuid">{{ cluster.uuid }}</p>
          <h3 class="cluster-name">{{ cluster.name }}</h3>
          <div class="cluster-device-list">
            <ul>
              <li class="microdevice" v-for="device in cluster.devices" :key="device.uuid">
                {{ device.name }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </section>

    <p v-else>Loading clusters...</p>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Define interfaces for Cluster and Device
interface Device {
  uuid: string
  name: string
  // Add other device properties as needed
}

interface Cluster {
  uuid: string
  name: string
  devices: Device[]
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

const fetchClusters = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/clusters', {
      headers: {
        Accept: 'application/json',
      },
      withCredentials: true,
    })

    if (response.status === 200) {
      // Assign fetched data to the reactive variable
      clusters.value = response.data.map((clusterData: Cluster) => ({
        ...clusterData,
        devices: [], // Initialize devices array for each cluster
      }))
      console.log('Clusters fetched successfully', clusters.value)
    } else {
      console.error('Failed to fetch clusters with status code', response.status)
    }
  } catch (error) {
    console.error('Failed to fetch clusters', error)
  }
}

const fetchDevices = async (clusters: Cluster[]) => {
  try {
    // Fetch devices for each cluster
    for (const cluster of clusters) {
      const response = await axios.get(
        `http://localhost:3001/api/v1/clusters/${cluster.uuid}/devices`,
        {
          headers: {
            Accept: 'application/json',
          },
          withCredentials: true,
        },
      )

      if (response.status === 200) {
        // Update the devices array for the cluster
        cluster.devices = response.data
        console.log(`Devices fetched for cluster ${cluster.uuid}`, cluster.devices)
      } else {
        console.error(
          `Failed to fetch devices for cluster ${cluster.uuid} with status code`,
          response.status,
        )
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
  await fetchClusters()
  await fetchDevices(clusters.value) // Fetch devices after clusters are loaded
})
</script>

<style lang="scss" scoped>
.cluster-list {
  list-style-type: none;
  padding: 0;
}

.cluster-entry {
  margin: 0 1rem 1rem;
  padding: 1rem;
  background-color: var(--light);
  max-width: 20rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    // transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
    border-top: 5px solid;
    border-image: linear-gradient(to right, var(--primary), var(--secondary)) 1;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .cluster-uuid {
    font-size: 0.9rem;
    color: var(--dark-alt);
    margin-bottom: 0.5rem;
  }

  .cluster-name {
    margin: 0;
  }

  .cluster-device-list {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
  }

  &:hover .cluster-device-list {
    max-height: 500px; // Adjust this value based on the expected content height
  }
}


.microdevice {
  padding: 1rem;
  margin: 0.5rem 0;
  background-color: var(--light);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    // transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-left: 5px solid;
    border-image: linear-gradient(to bottom, var(--primary), var(--secondary)) 1;
  }
}

</style>

