<template>
  <div>
    <button class="cluster-delete" @dblclick="handleDelete">Delete</button>
    <button class="cluster-edit" @dblclick="handleEdit">Edit</button>
    <button class="cluster-add-device" @dblclick="handleAddDevice">Add Device</button>
  </div>
</template>

<script lang="ts" setup>
import { deleteCluster } from '@/api/client';
import { defineProps } from 'vue'

interface ClusterActionProps {
  uuid: string
  name: string
}

const props = defineProps<ClusterActionProps>()

const handleDelete = () => {
  deleteCluster([props.uuid])
  console.log(`Deleting cluster ${props.uuid}`)
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
