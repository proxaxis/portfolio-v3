<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import IconArrowUp from '@/components/icons/IconArrowUp.vue';

const route = useRoute();
const router = useRouter();

const isTopButtonVisible = ref(false);
const prevPageName = ref('Home');
const rfTop = ref(null);

function handleScroll() {
  const currentScrollY = window.scrollY;

  if (currentScrollY <= 100) {
    // ページ上部では常に非表示
    isTopButtonVisible.value = false;
  } else if (currentScrollY < this.lastScrollY) {
    // スクロールアップした場合
    isTopButtonVisible.value = true;
  } else {
    // スクロールダウンした場合
    isTopButtonVisible.value = false;
    if (route.hash === '#top') router.push({ hash: '' });
  }
  this.lastScrollY = currentScrollY;
}

function goPageTop() {
  rfTop.value.scrollIntoView({
    behavior: 'smooth',
  });
}

watch(() => route, (to) => {
  if (to.name !== prevPageName.value) {
    rfTop.value.scrollIntoView({
      behavior: 'smooth',
    })
    prevPageName.value = to.name
  }
  if (to.hash === '#top') {
    rfTop.value.scrollIntoView({
      behavior: 'smooth',
    })
  }
}, { deep: true });

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <header ref="rfTop">
    <AppHeader />
  </header>
  <main>
    <router-view />
    <IconArrowUp v-show="isTopButtonVisible" class="go-top-button" @click="goPageTop" />
  </main>
  <footer>
    <AppFooter />
  </footer>
</template>

<style lang="scss">
@use 'sass:color';
@use '@/styles/variables.scss' as var;

:root {
  color-scheme: light dark;
  --border-radius: 6px;
  --header-height: 60px;
}

:root[data-theme='light'] {
  @include var.spread-vars(light);
}

:root[data-theme='dark'] {
  @include var.spread-vars(dark);
  box-sizing: border-box;
}

html,
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
  height: 100%;
  scroll-behavior: smooth;
}

h1,
h2,
h3,
h4,
h5,
h6,
label,
p,
a,
a:active,
a:visited {
  color: var(--text-0);
  text-decoration: none;
}

a:hover {
  color: var(--accent);
}

nav,
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--text-0);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  width: 100%;
  background-color: var(--bg-1);
}

main {
  margin-top: var(--header-height);
  padding: 0 1rem 1rem 1rem;
  background-color: var(--bg-0);
}

footer {
  flex-grow: 1;
  background-color: var(--bg-1);
}

.go-top-button {
  position: fixed;
  width: 5rem;
  height: 4rem;
  right: 1rem;
  bottom: 1rem;
  background-color: transparent;
  opacity: 0.6;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
  @include var.narrow() {
    right: 3rem;
    bottom: 6rem;
  }
}

.icons {
  fill: var(--text-0);
}
</style>
