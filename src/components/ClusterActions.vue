<template>
  <div class="cluster-actions">
    <button class="action-button cluster-delete" @dblclick="handleDelete">
      <span class="material-icons">delete</span>
      Delete
    </button>
    <button class="action-button cluster-edit" @dblclick="handleEdit">
      <span class="material-icons">edit</span>
      Edit
    </button>
    <button class="action-button cluster-add-device" @click.prevent="handleAddDevice">
      <span class="material-icons">add_circle</span>
      Add Device
    </button>
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
const emits = defineEmits<{
  (e: 'add-device', uuid: string): string
}>()

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
  toast.success(`Cluster '${props.name}' was deleted`)
}

const handleEdit = () => {
  console.log(`Editing cluster ${props.uuid}`)
}

const handleAddDevice = () => {
  console.log(`Adding device to cluster ${props.uuid}`)

  emits('add-device', props.uuid)
}
</script>

<style lang="scss" scoped>
.cluster-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.3rem 0.3rem;
  font-size: 0.9rem;
  font-weight: 300;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: darken(#d9534f, 10%); /* Slightly darken on hover */
    transform: translateY(-2px); /* Lift effect */
  }

  &.cluster-delete {
    background-color: #d9534f;
  }

  &.cluster-edit {
    background-color: goldenrod;
  }

  &.cluster-add-device {
    background-color: var(--secondary);
  }
}
</style>
