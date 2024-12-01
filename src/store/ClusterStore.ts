import {
  fetchClusters,
  type Microdevice,
  type Cluster,
  getClusterMicrodevices as fetchClusterMicrodevices,
  deleteCluster as apiDeleteClusters,
  createCluster as apiCreateCluster,
  createMicrodevice as apiCreateMicrodevice,
  type Result,
  Ok,
  Err,
  type Topic,
} from '@/api/client'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export const useClusterStore = defineStore('clusters', () => {
  const clusters: Ref<Cluster[]> = ref([])
  const clusterMicrodevices: Ref<Map<string, Microdevice[]>> = ref(new Map())

  const isLoading = ref(false)

  const createCluster = async (
    name: string,
    region: string,
    description?: string,
  ): Promise<Result<Cluster, Error>> => {
    const res = await apiCreateCluster(name, region, description)

    if (!res.ok) {
      return Err(new Error('Failed to create cluster'))
    }

    clusters.value.push(res.data)
    console.log(res.data)
    console.log()
    clusterMicrodevices.value.set(res.data.uuid, [])

    return Ok(res.data)
  }

  const getClusters = async (): Promise<Result<boolean, Error>> => {
    isLoading.value = true
    const res = await fetchClusters()
    if (!res.ok) {
      return Err(new Error('Failed to fetch clusters'))
    }

    clusters.value = res.data

    res.data.forEach(async (cluster) => {
      const res = await fetchClusterMicrodevices(cluster.uuid, true, true, true)

      if (!res.ok) {
        return Err(new Error('Failed to fetch microdevices'))
      }

      clusterMicrodevices.value.set(cluster.uuid, res.data)
    })

    isLoading.value = false
    return Ok(true)
  }

  const getClusterMicrodevices = (clusterId: string): Microdevice[] => {
    return clusterMicrodevices.value.get(clusterId) || []
  }

  const createMicrodevice = async (
    clusterId: string,
    name: string,
    description?: string,
    topic?: Topic[],
  ): Promise<Result<Microdevice, Error>> => {
    const res = await apiCreateMicrodevice(clusterId, name, description, topic)

    if (!res.ok) {
      return Err(new Error('Failed to create microdevice'))
    }

    const microdevices = clusterMicrodevices.value.get(clusterId) || []
    microdevices.push(res.data)
    clusterMicrodevices.value.set(clusterId, microdevices)

    return Ok(res.data)
  }

  const getClusterCount = (): number => {
    return clusters.value.length
  }

  const getRegions = (): string[] => {
    return ['us-west-1', 'us-east-1', 'eu-west-1', 'eu-central-1', 'ap-northeast-1']
  }

  const getMicrodeviceCount = (): number => {
    return Array.from(clusterMicrodevices.value.values()).reduce((acc, val) => acc + val.length, 0)
  }

  const deleteClusters = async (clusterIds: string[]): Promise<Result<number, Error>> => {
    // Delete cluster from cluster-microdevice map
    clusterIds.forEach((clusterId) => {
      clusterMicrodevices.value.delete(clusterId)
    })

    // Delete cluster from clusters array
    clusters.value = clusters.value.filter((cluster) => !clusterIds.includes(cluster.uuid))

    const res = await apiDeleteClusters(clusterIds)

    if (!res.ok) {
      return Err(new Error('Failed to delete clusters'))
    }

    return Ok(res.data.deleted)
  }

  return {
    clusters,
    clusterMicrodevices,
    isLoading,
    createCluster,
    getRegions,
    getClusters,
    getClusterMicrodevices,
    createMicrodevice,
    getMicrodeviceCount,
    getClusterCount,
    deleteClusters,
  }
})
