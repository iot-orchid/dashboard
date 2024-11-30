<template>
  <p>{{ props.uuid }}</p>
  <h3>{{ props.name }}</h3>
  <div class="cluster-details">
    <ClusterActions :uuid="props.uuid" :name="props.name" />
    <ul v-if="props.microdevices">
      <li v-for="md in props.microdevices" :key="md.id">
        <MicrodeviceCard :name="md.name" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import ClusterActions from './ClusterActions.vue'
import MicrodeviceCard from './MicrodeviceCard.vue'
import type { Microdevice } from '@/api/client'

const props = defineProps<{
  uuid: string
  name: string
  microdevices?: Array<Microdevice>
}>()
</script>

<style lang="scss" scoped>
li {
  margin: 0 1rem 1rem;
  padding: 1rem;
  background-color: var(--light);
  max-width: 20rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

p {
  font-size: 0.9rem;
  color: var(--dark-alt);
  margin-bottom: 0.5rem;
}

h3 {
  margin: 0;
  margin-bottom: 0.5rem;
}

ul {
  margin-top: 1rem;
  padding: 0;
  list-style: none;
}

.cluster-details {
  justify-content: center;
}


</style>
