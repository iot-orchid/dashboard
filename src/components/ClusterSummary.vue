<template>
  <div class="summary">
    <div class="card cluster-count">
      <h2>Total Clusters</h2>
      <p>{{ clusterStore.getClusterCount() }} clusters</p>
    </div>
    <div class="card microdevice-count">
      <h2>Total Microdevices</h2>
      <p>{{ clusterStore.getMicrodeviceCount() }} microdevices</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useClusterStore } from '@/store/ClusterStore'

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
    background-color: #ffffff; // Light card background
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
      color: #333; // Darker text for headings
    }

    p {
      font-size: 1rem; // Clean paragraph size
      color: #666; // Subtle text color
    }
  }
}
</style>
