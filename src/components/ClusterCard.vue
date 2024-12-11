<template>
  <div class="cluster-card" :class="appStore.colorMode">
    <div class="cluster-card-header">
      <h3 class="cluster-name">{{ props.name }}</h3>
      <ClusterActions :uuid="props.uuid" :name="props.name" @add-device="toggleAddDeviceForm" />
    </div>
    <p class="cluster-uuid">UUID: {{ props.uuid }}</p>
    <div class="cluster-card-body">
      <ul v-if="microdevices" class="microdevice-list">
        <li v-for="md in microdevices" :key="md.id" class="microdevice-item">
          <MicrodeviceCard :name="md.name" />
        </li>
      </ul>
      <p v-else class="empty-state">No microdevices found for this cluster.</p>
      <div v-if="showAddDeviceForm" class="add-device-form">
        <form>
          <input type="text" placeholder="Microdevice name" />
          <input type="text" placeholder="Description" />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed } from 'vue'
import ClusterActions from './ClusterActions.vue'
import MicrodeviceCard from './MicrodeviceCard.vue'
import { useClusterStore } from '@/store/ClusterStore'
import { useAppStore } from '@/store/AppStore'

const appStore = useAppStore()
const clusterStore = useClusterStore()
const showAddDeviceForm = ref(false)

const props = defineProps<{
  uuid: string
  name: string
}>()

const toggleAddDeviceForm = () => {
  showAddDeviceForm.value = !showAddDeviceForm.value
}

const microdevices = computed(() => clusterStore.getClusterMicrodevices(props.uuid))
</script>


<style lang="scss" scoped>
.cluster-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;

  &.dark {
    background: var(--dark-alt);
    color: white;
  }

  &.light {
    background: white;
    color: black;
  }

  .cluster-card-header {
    display: flex;
    flex-direction: column;
    /* Stack children vertically */
    align-items: flex-start;
    /* Align content to the left */
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    margin-bottom: 16px;

    .cluster-name {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 8px;
      /* Add spacing between name and actions */
    }
  }


  .cluster-card &.dark {
    color: white;
  }

  .cluster-card &.light {
    color: #333;
  }

  .cluster-uuid {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 16px;
  }

  .cluster-card-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .microdevice-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      list-style: none;
      padding: 0;
    }

    .microdevice-item {
      display: flex;
      justify-content: center;
    }

    .empty-state {
      text-align: center;
      color: #999;
      font-size: 0.95rem;
    }

    .add-device-form {
      form {
        display: flex;
        flex-direction: column;
        gap: 8px;

        input {
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        button {
          padding: 8px 12px;
          background-color: var(--primary);
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: var(--secondary);
          }
        }
      }
    }
  }
}
</style>
