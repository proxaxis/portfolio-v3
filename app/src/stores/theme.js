import { ref, onMounted, onUnmounted } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light');
  const mediaQuery = ref(null);

  function getSystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    theme.value = t;
  }

  function handleThemeChange(e) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
  
  onMounted(() => {
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
  
    mediaQuery.value = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.value.addEventListener('change', handleThemeChange);
  });

  onUnmounted(() => {
    mediaQuery.value.removeEventListener('change', handleThemeChange);
  });

  return { theme, applyTheme };
});
