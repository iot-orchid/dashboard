<template>
  {{ props.name }}
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  name: string
}>()
</script>

<style lang="scss" scoped>
div {
  // Basic styling for the list item
  margin: 0 1rem 1rem;
  padding: 1rem;
  background-color: var(--light);
  max-width: 20rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
