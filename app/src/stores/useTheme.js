import { ref, onMounted, onUnmounted } from 'vue';
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref('light');

  // システムのテーマ設定を取得
  function getSystemTheme() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // テーマを適用
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    theme.value = t;
  }

  onMounted(() => {
    // システムテーマを取得して適用
    const systemTheme = getSystemTheme();
    applyTheme(systemTheme);
  
    // システムテーマの変更を監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (e) => {
      applyTheme(e.matches ? 'dark' : 'light');
    }
    mediaQuery.addEventListener('change', handleThemeChange);
  });

  onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleThemeChange);
  });

  return { theme, applyTheme };
});
