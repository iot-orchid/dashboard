import axios from 'axios'
import API_ENDPOINTS from './endpoints'

// ----------------------
// Result Type Definition
// ----------------------
export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E }

// ----------------------
// Utility Functions for Result
// ----------------------
export function Ok<T, E>(data: T): Result<T, E> {
  return { ok: true, data }
}

export function Err<T, E>(error: E): Result<T, E> {
  return { ok: false, error }
}

// ----------------------
// Axios Client Definition
// ----------------------
const client = axios.create({
  baseURL: API_ENDPOINTS.API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

// ----------------------
// Interfaces
// ----------------------
export type Topic = {
  name: string
  qos: number
  topic: string
}
export type Microdevice = {
  id: string
  name: string
  topics?: Topic[]
  description?: string
}

export type Cluster = {
  uuid: string
  name: string
}

export type CreateCluster = {
  name: string
  description?: string
  region?: string
}

export type DeleteClusterResponse = {
  deleted: number
  message: string
}

// ----------------------
// API Functions
// ----------------------

// API function for login
export const apiLogin = async (
  username: string,
  password: string,
): Promise<Result<boolean, Error>> => {
  try {
    const response = await client.post(`${API_ENDPOINTS.API_ENDPOINTS.LOGIN}`, {
      username,
      password,
    })

    if (response.status === 200) {
      return Ok(true)
    } else {
      return Err(new Error('Login failed'))
    }
  } catch (error) {
    console.error('Error logging in', error)
    if (error instanceof Error) {
      return Err(error)
    }
    return Err(new Error('Unknown error'))
  }
}

// API function to create a cluster
export const createCluster = async (
  name: string,
  region: string,
  description?: string,
): Promise<Result<Cluster, Error>> => {
  try {
    const res = await client.post(
      `${API_ENDPOINTS.API_ENDPOINTS.CLUSTERS}`,
      {
        name,
        region,
        description,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      },
    )

    if (res.status !== 200) {
      throw new Error('Error creating cluster')
    }

    return Ok(res.data)
  } catch (error) {
    console.error('Error creating cluster', error)
    if (error instanceof Error) {
      return Err(error)
    }
    return Err(new Error('Unknown error'))
  }
}

// API function to fetch clusters (optionally filtered by clusterId)
export const fetchClusters = async (clusterId?: string): Promise<Result<Array<Cluster>, Error>> => {
  try {
    const response = await client.get(`${API_ENDPOINTS.API_ENDPOINTS.CLUSTERS}`, {
      params: clusterId ? { cluster_id: clusterId } : {},
    })

    if (clusterId) {
      return Ok([response.data.cluster])
    }

    return Ok(response.data)
  } catch (error) {
    console.error('Error fetching clusters', error)
    if (error instanceof Error) {
      return Err(error)
    }
    return Err(new Error('Unknown error'))
  }
}

// API function to delete clusters by ID array
export const deleteCluster = async (
  clusterIds: Array<string>,
): Promise<Result<DeleteClusterResponse, Error>> => {
  try {
    const response = await client.delete(`${API_ENDPOINTS.API_ENDPOINTS.CLUSTERS}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        ids: clusterIds,
      },
      withCredentials: true,
    })

    if (response.status !== 200) {
      throw new Error('Error deleting cluster')
    }

    return Ok(response.data)
  } catch (error) {
    console.error('Error deleting cluster', error)
    if (error instanceof Error) {
      return Err(error)
    }
    return Err(new Error('Unknown error'))
  }
}

// API function to fetch microdevices for a given cluster
export const getClusterMicrodevices = async (
  clusterId: string,
  includeTopics?: boolean,
  includeDescription?: boolean,
  includeClusterId?: boolean,
): Promise<Result<Array<Microdevice>, Error>> => {
  try {
    const response = await client.get(`cluster/${clusterId}/devices`, {
      params: {
        include_topics: includeTopics ? includeTopics : false,
        include_description: includeDescription ? includeDescription : false,
        include_cluster_id: includeClusterId ? includeClusterId : false,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    })

    return Ok(response.data)
  } catch (error) {
    console.error('Error fetching cluster microdevices', error)

    if (error instanceof Error) {
      return Err(error)
    } else {
      return Err(new Error('Unknown error'))
    }
  }
}
