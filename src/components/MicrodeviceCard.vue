<template>
  <div class="card">
    <div class="card-header">
      <h2>{{ props.name }}</h2>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div class="card-footer">
      <button class="btn">Action</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps<{
  name: string
}>()
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  margin: 0 1rem 1rem;
  padding: 1rem;
  background-color: #fff;
  max-width: 20rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
}

.card-header {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #333;
  }
}

.card-body {
  flex: 1;
  padding: 0.5rem 0;
}

.card-footer {
  border-top: 1px solid #eaeaea;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  text-align: right;

  .btn {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
