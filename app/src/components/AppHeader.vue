<script setup>
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/useTheme';
import IconMoon from '@/components/icons/IconMoon.vue';
import IconSun from '@/components/icons/IconSun.vue';

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();

const isHeaderVisible = ref(true);
const isMenuVisible = ref(false);
const isNarrowWindow = ref(window.innerWidth < 1024);
const headerTop = ref('0px');
const lastTop = ref(0);
const scr = ref(0);
const timeout = ref(null);

const themeIcon = computed(() => themeStore.theme === 'light' ? IconMoon : IconSun);

function handleResize() {
  isNarrowWindow.value = window.innerWidth < 1024;
}

function fixURL(name) {
  if (route.name === name) {
    return `${route.path}#top`;
  }
  return router.resolve({ name }).href;
}

function changeTheme() {
  themeStore.applyTheme(themeStore.theme === 'light' ? 'dark' : 'light');
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', () => scr.value = window.scrollY);
});

watch(() => scr.value, (to) => {
  const delay = 150;
  const headerHeight = 60;
  if (to < lastTop.value) {
    // スクロールアップした場合に実行するもの
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      isHeaderVisible.value = true;
      isMenuVisible.value = false;
      lastTop.value = to;
    }, delay);
    if (!isHeaderVisible.value) headerTop.value = String(-1*headerHeight + Math.min(lastTop.value - to, headerHeight)) + 'px';
  }	else {
    // スクロールダウンした場合に実行するもの
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      isHeaderVisible.value = false;
      isMenuVisible.value = false;
      lastTop.value = to;
    }, delay);
    if (isHeaderVisible.value) headerTop.value = String(-1*(Math.min(to - lastTop.value, headerHeight))) + 'px';
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('scroll', () => scr.value = window.scrollY);
});
</script>

<template>
  <div class="app-header" :class="{ narrow: isNarrowWindow, show: isHeaderVisible }">
    <router-link :to="fixURL('Home')" class="site-logo">PORTFOLIO</router-link>

    <button class="burger-button" type="button" aria-label="メニューを開く" @click="isMenuVisible = !isMenuVisible">
      <span></span>
      <span></span>
      <span></span>
    </button>

    <nav class="menu" :class="{ open: isMenuVisible }">
      <ul>
        <li><router-link :to="fixURL('Home')" @click="isMenuVisible = false">Home</router-link></li>
        <li><router-link :to="fixURL('Products')" @click="isMenuVisible = false">Products</router-link></li>
        <li><router-link :to="fixURL('Articles')" @click="isMenuVisible = false">Articles</router-link></li>
        <li><router-link :to="fixURL('Tools')" @click="isMenuVisible = false">Tools</router-link></li>
        <li><router-link :to="fixURL('Contact')" @click="isMenuVisible = false">Contact</router-link></li>
        <li>
          <button @click="changeTheme">
            <component :is="themeIcon" size="1.25rem" />
            <span v-if="isNarrowWindow">Toggle Theme</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as var;

$burger-menu-height: 250px;
$header-height: var(--header-height);

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: v-bind(headerTop);
  left: 0;
  width: calc(100% - 2rem);
  height: var(--header-height);
  padding: 0 1rem;
  z-index: 1000;
  background-color: var(--bg-1);

  // ヘッダーが表示中のスタイル
  box-shadow: 0 2px 4px var(--shadow);

  // サイトロゴ
  .site-logo {
    font-weight: bold;
    font-size: 1.25rem;
    z-index: 1001;
  }

  // テーマ切替ボタン
  button {
    background: none;
    border: none;
    cursor: pointer;
    z-index: 1001;
    padding: 0;
    display: flex;
    gap: 0.5rem;
    font-size: 1.15rem;
    align-items: center;
  }

  // --- PC 表示のスタイル ---
  .burger-button {
    display: none;
  }

  // ナビゲーションメニューをヘッダー内に配置
  .menu {
    ul {
      display: flex;
      align-items: center;
      li {
        margin: 0 0 0 1.5rem;
        a {
          font-size: 1.15rem;
          font-weight: normal;
        }
      }
    }
  }

  // --- モバイル表示のスタイル ---
  &.narrow {
    // ハンバーガーメニュー
    .burger-button {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 30px;
      height: 24px;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      z-index: 1100; // メニューより前に配置

      span {
        display: block;
        width: 100%;
        height: 2px;
        background-color: var(--text-0);
      }
    }

    // ナビゲーションメニュー
    .menu {
      position: fixed;
      top: var(--header-height);
      left: 0;
      width: 100%;
      height: $burger-menu-height;
      transition: transform 0.3s ease-in-out;
      background-color: var(--bg-2);
      z-index: 900; // ヘッダーの下に配置
      transform-origin: top;
      transform: scaleY(0);
      box-shadow: 0 2px 4px var(--shadow);

      &.open {
        transform: scaleY(1);
      }

      ul {
        display: grid;
        grid-template-rows: repeat(5, 1fr);
        height: 100%;
        li {
          display: flex;
          align-items: center;
          margin: 0 1rem;
          padding: 0.5rem 0;
          a {
            display: block;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>