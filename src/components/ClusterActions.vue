<template>
  <div>
    <button class="cluster-delete" @dblclick="handleDelete">Delete</button>
    <button class="cluster-edit" @dblclick="handleEdit">Edit</button>
    <button class="cluster-add-device" @dblclick="handleAddDevice">Add Device</button>
  </div>
</template>

<script lang="ts" setup>
import { useClusterStore } from '@/store/ClusterStore'
import { defineProps } from 'vue'
import { useToast } from 'vue-toastification'

interface ClusterActionProps {
  uuid: string
  name: string
}

const props = defineProps<ClusterActionProps>()

const toast = useToast()

const handleDelete = async () => {
  const res = await useClusterStore().deleteClusters([props.uuid])
  if (!res.ok) {
    toast.error('Failed to delete cluster')
    console.error(res.error)
    return
  }

  if (res.data === 0) {
    toast.error(`Cluster '${props.name}' was not found`)
    return
  }
  toast.success(`Cluster '${props.name}' was deleted` )
}

const handleEdit = () => {
  console.log(`Editing cluster ${props.uuid}`)
}

const handleAddDevice = () => {
  console.log(`Adding device to cluster ${props.uuid}`)
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  justify-content: center;

  .cluster-delete {
    background-color: #d9534f;
    border-radius: 4px 0 0 4px;
  }

  .cluster-edit {
    background-color: goldenrod;
  }

  .cluster-add-device {
    background-color: var(--secondary);
    border-radius: 0 4px 4px 0;
  }
}

button {
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: var(--light);

  &:hover {
    filter: brightness(0.8);
  }
}
</style>
