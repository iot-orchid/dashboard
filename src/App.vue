<template>
  <div class="app" :class="appStore.colorMode">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Content -->
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import AppSidebar from './components/AppSidebar.vue'
import { useAppStore } from './store/AppStore';


const appStore = useAppStore()

</script>

<style lang="scss">
:root {
  --primary: #0ea5e9;    /* Electric Blue */
  --secondary: #14b8a6;  /* Teal */
  --grey: #64748b;       /* Slate Gray */
  --dark: #0f172a;       /* Dark Blue Gray */
  --dark-alt: #1e293b;   /* Medium Blue Gray */
  --light: #e2e8f0;      /* Light Gray */
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira sans', sans-serif;
}

body {
  background: var(--light);
}

.app.dark {
  background: var(--dark);
}

.app.light {
  background: var(--light);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  display: flex;

  main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 1024px) {
      padding-left: 6rem;
    }
  }
}
</style>
