<template>
  <li>
    <p>{{ props.uuid }}</p>
    <h3>{{ props.name }}</h3>
    <ClusterActions :uuid="props.uuid" :name="props.name" />
    <ul v-if="props.microdevices">
      <t v-for="md in props.microdevices" :key="md.id">
        <MicrodeviceCard :name="md.name" />
      </t>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import ClusterActions from './ClusterActions.vue'
import MicrodeviceCard from './MicrodeviceCard.vue';
import type { Microdevice } from '@/api/client';

const props = defineProps<{
  uuid: string,
  name: string,
  microdevices?: Array<Microdevice>,
}>()
</script>

<style lang="scss" scoped>
li {
  list-style-type: none;
  // Basic styling for the list item
  margin: 0 1rem 1rem;
  padding: 1rem;
  background-color: var(--light);
  max-width: 20rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  // Hide cluster actions by default
  :deep(.cluster-actions) {
    display: none;
  }

  // Styling for hover state
  &:hover {
    border-top: 5px var(--primary) solid;

    // Show cluster actions on hover
    :deep(.cluster-actions) {
      display: flex;
    }
  }
}

p {
  font-size: 0.9rem;
  color: var(--dark-alt);
  margin-bottom: 0.5rem;
}

h3 {
  margin: 0;
}

</style>
