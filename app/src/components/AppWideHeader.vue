<script setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/theme';
import { useUserStore } from '@/stores/user';
import IconMoon from '@/components/icons/IconMoon.vue';
import IconSun from '@/components/icons/IconSun.vue';
import IconBoxOpen from '@/components/icons/IconBoxOpen.vue';
import IconHouse from '@/components/icons/IconHouse.vue';
import IconNewspaper from '@/components/icons/IconNewspaper.vue';
import IconScrewdriverWrench from '@/components/icons/IconScrewdriverWrench.vue';
import IconCommentDots from '@/components/icons/IconCommentDots.vue';

const route = useRoute();
const router = useRouter();
const themeStore = useThemeStore();
const userStore = useUserStore();

const isHeaderVisible = ref(true);
const lastScrollY = ref(0);

const themeIconComponent = computed(() => themeStore.theme === 'light' ? IconMoon : IconSun);

function changeTheme() {
  themeStore.applyTheme(themeStore.theme === 'light' ? 'dark' : 'light');
}

function handleScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY < 50) {
    isHeaderVisible.value = true;
    lastScrollY.value = currentScrollY;
    return;
  }

  if (currentScrollY > lastScrollY.value) {
    isHeaderVisible.value = false;
  } else {
    isHeaderVisible.value = true;
  }

  lastScrollY.value = currentScrollY;
}

function transition(name) {
  if (route.name === name) userStore.isGoingTop = true;
  else router.push({ name });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header class="app-wide-header" :class="{ 'is-hidden': !isHeaderVisible }">
    <button class="logo" @click="transition('Home')">PORTFOLIO</button>

    <nav>
      <ul>
        <li :class="{ active: userStore.lastPageIndex === 0 }">
          <button @click="transition('Home')">
            <IconHouse size="1.85rem" />
            <span>HOME</span>
          </button>
        </li>
        <li :class="{ active: userStore.lastPageIndex === 1 }">
          <button @click="transition('Products')">
            <IconBoxOpen size="1.85rem" />
            <span>WORKS</span>
          </button>
        </li>
        <li :class="{ active: userStore.lastPageIndex === 2 }">
          <button @click="transition('Articles')">
            <IconNewspaper size="1.85rem" />
            <span>ARTICLES</span>
          </button>
        </li>
        <li :class="{ active: userStore.lastPageIndex === 3 }">
          <button @click="transition('Tools')">
            <IconScrewdriverWrench size="1.85rem" />
            <span>TOOLS</span>
          </button>
        </li>
        <li :class="{ active: userStore.lastPageIndex === 4 }">
          <button @click="transition('Contact')">
            <IconCommentDots size="1.85rem" />
            <span>CONTACT</span>
          </button>
        </li>
        <li>
          <button @click="changeTheme">
            <Component :is="themeIconComponent" size="1.85rem" />
            <span>THEME</span>
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  height: var(--header-height);
  background-color: var(--bg-1);
  width: 100%;
  z-index: 1000;
  transition: top 0.3s ease-in-out;
  box-shadow: 0 4px 4px var(--shadow);
}

header.is-hidden {
  top: calc(var(--header-height) * -1 - 1rem);
}

.logo {
  font-size: 1.5rem;
  height: 100%;
  box-sizing: border-box;
  padding: 0 1rem;
  font-family: "Anton SC", sans-serif;
  color: var(--accent);
  transition: transform 0.35s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

nav ul {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  li {
    position: relative;
    display: inline-block;

    &::after {
      content: "";
      position: absolute;
      left: 50%;
      width: 0;
      height: 2px;
      background-color: var(--accent);
      transition: width 0.4s ease-in-out, transform 0.4s ease-in-out;
      transform: translateX(-50%);
    }

    &:hover::after {
      width: 60%;
    }

    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1rem;
      padding: 0.3rem 1rem;

      span {
        font-size: 0.75rem;
      }
    }

    &.active {
      &::after{
        width: 60%;
      }

      * {
        color: var(--accent);
        fill: var(--accent);
      }
    }
  }
}
</style>