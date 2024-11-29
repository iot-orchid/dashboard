import axios from 'axios'
import API_ENDPOINTS from './endpoints'

// ----------------------
// Result Type Definition
// ----------------------
type Result<T, E> = { ok: true; data: T } | { ok: false; error: E }

// ----------------------
// Utility Functions for Result
// ----------------------
function Ok<T, E>(data: T): Result<T, E> {
  return { ok: true, data }
}

function Err<T, E>(error: E): Result<T, E> {
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
interface Topic {
  name: string
  qos: number
  topic: string
}

export interface Microdevice {
  id: string
  name: string
  topics?: Topic[]
  description?: string
}

// ----------------------
// API Functions
// ----------------------

// API function for login
export const apiLogin = async (username: string, password: string) => {
  try {
    const response = await client.post(`${API_ENDPOINTS.API_ENDPOINTS.LOGIN}`, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    console.error('Error logging in', error)
  }
}

// API function to fetch clusters (optionally filtered by clusterId)
export const getClusters = async (clusterId?: string) => {
  try {
    const response = await client.get(
      `${API_ENDPOINTS.API_ENDPOINTS.CLUSTERS}${clusterId ? { clusterId } : ''}`,
    )
    return response.data
  } catch (error) {
    console.error('Error fetching clusters', error)
  }
}

// API function to delete clusters by ID array
export const deleteCluster = async (clusterIds: Array<string>) => {
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
    return response.data
  } catch (error) {
    console.error('Error deleting cluster', error)
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
