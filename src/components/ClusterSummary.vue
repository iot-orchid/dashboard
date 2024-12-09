<template>
  <div class="summary" :class="appStore.colorMode">
    <div class="card cluster-count" :class="appStore.colorMode">
      <h2>Total Clusters</h2>
      <p>{{ clusterStore.getClusterCount() }} clusters</p>
    </div>
    <div class="card microdevice-count" :class="appStore.colorMode">
      <h2>Total Microdevices</h2>
      <p>{{ clusterStore.getMicrodeviceCount() }} microdevices</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/AppStore';
import { useClusterStore } from '@/store/ClusterStore'

const appStore = useAppStore()

const clusterStore = useClusterStore()
</script>

<style lang="scss" scoped>
.summary {
  display: flex;
  flex-direction: row;
  justify-content: space-between; // Distribute cards evenly
  align-items: stretch; // Make cards align vertically
  gap: 2rem; // Modern spacing between cards
  padding: 2rem; // Add padding around the container
  max-width: 800px; // Limit the width of the container
  .card {
    flex: 1; // Allow cards to stretch equally
    padding: 1.5rem; // Modern inner spacing

    &.dark {
      background: var(--dark-alt); // Darker background for dark mode
      color: white; // Light text for dark mode
    }

    &.light {
      background: white; // Light background for light mode
      color: black; // Dark text for light mode
    }

    border-radius: 8px; // Modern rounded corners
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Subtle shadow for depth
    text-align: center; // Center-align text
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-5px); // Slight lift effect on hover
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); // Slightly deeper shadow
    }

    h2 {
      font-size: 1.25rem; // Modern heading size
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1rem; // Clean paragraph size
    }

    p &.dark {
      color: #ccc; // Lighter text for dark mode
    }

    p &.light {
      color: #666; // Darker text for light mode
    }
  }
}
</style>
