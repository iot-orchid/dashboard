import { defineStore } from 'pinia'
import { ref, computed, onMounted, watch } from 'vue'

enum ColorMode {
  Light = 'light',
  Dark = 'dark',
}

export const useAppStore = defineStore('color-mode', () => {
  // Reactive state for user-triggered preferences
  const userPreferredMode = ref<ColorMode | null>(null) // Null if not set by user
  const systemColorMode = ref<ColorMode>( // Reactive state for system preference
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ColorMode.Dark
      : ColorMode.Light
  )

  // Computed color mode based on user preference and system theme
  const colorMode = computed(() => {
    return userPreferredMode.value ?? systemColorMode.value
  })

  // Function to toggle dark mode
  const setDarkMode = () => {
    userPreferredMode.value = ColorMode.Dark
  }

  // Function to toggle light mode
  const setLightMode = () => {
    userPreferredMode.value = ColorMode.Light
  }

  // Function to reset to system preference
  const resetToSystemPreference = () => {
    userPreferredMode.value = null
  }

  // Sync with system theme changes
  const syncWithSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateSystemPreference = () => {
      systemColorMode.value = mediaQuery.matches ? ColorMode.Dark : ColorMode.Light
    }

    // Initial update to reflect the current system preference
    updateSystemPreference()

    // Listen for changes in system theme
    mediaQuery.addEventListener('change', updateSystemPreference)

    // Clean up listener when the store is no longer used
    onMounted(() => {
      watch(userPreferredMode, () => {
        if (!userPreferredMode.value) {
          updateSystemPreference() // Reset system preference if user resets
        }
      })
    })

    watch(() => userPreferredMode.value, (newValue) => {
      if (newValue === null) {
        updateSystemPreference()
      }
    })

    return () => {
      mediaQuery.removeEventListener('change', updateSystemPreference)
    }
  }

  // Call syncWithSystemTheme once when the store is initialized
  syncWithSystemTheme()

  return {
    colorMode, // Reactive and computed
    setDarkMode,
    setLightMode,
    resetToSystemPreference,
  }
})
