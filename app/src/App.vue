<script setup>
import { onMounted, onUnmounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { TAB_PAGE_NAMES } from '@/lib/constants';
import AppWideHeader from '@/components/AppWideHeader.vue';
import AppNarrowHeader from '@/components/AppNarrowHeader.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const prevPageName = ref('Home');
const rfTop = ref(null);
const isNarrowWindow = ref(window.innerWidth < 1024);

const headerComponent = computed(() => isNarrowWindow.value ? AppNarrowHeader : AppWideHeader);

function handleResize() {
  isNarrowWindow.value = window.innerWidth < 1024;
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
  userStore.lastPageIndex = TAB_PAGE_NAMES.indexOf(to.name);
}, { deep: true });

watch(() => userStore.isGoingTop, (to) => {
  if (to) {
    rfTop.value.scrollIntoView({
      behavior: 'smooth',
    });
    userStore.isGoingTop = false;
  }
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div ref="rfTop" style="width: 100%;"></div>
  <Component :is="headerComponent" />
  <main>
    <router-view />
  </main>
  <footer>
		<p>&copy; 2025 Hosoda Yoshiki. All Rights Reserved.</p>
		<p>
			&copy;<a href="https://github.com/twitter/twemoji" target="_blank" rel="noopener noreferrer">Twemoji</a> by Copyright 2021 Twitter, Inc and other contributors is licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC-BY 4.0</a>
		</p>
		<p>Thanks: <a href="https://www.whatistoday.cyou/index.cgi/">今日は何の日API</a>、<a href="https://www.open-meteo.com/">Open-Meteo</a></p>
  </footer>
</template>

<style lang="scss">
@use 'sass:color';
@use '@/styles/variables.scss' as var;

:root {
  color-scheme: light dark;
  @include var.spread-size-vars();
}

:root[data-theme='light'] {
  @include var.spread-theme-vars(light);
}

:root[data-theme='dark'] {
  @include var.spread-theme-vars(dark);
  box-sizing: border-box;
}

html,
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 0;
  margin: 0;
  scroll-behavior: smooth;
  interpolate-size: allow-keywords;
  overscroll-behavior-x: none !important;
  background-color: var(--bg-0);
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
}

main {
  min-height: 100vh;
  width: 100%;
  min-width: var(--vw-min-width);
  max-width: var(--vw-max-width);
  margin: calc(var(--header-height) + var(--main-margin-top)) auto var(--main-margin-bottom) auto;

  @include var.narrow() {
    padding: 0 1rem;
    width: calc(100% - 2rem);
  }
}

footer {
  background-color: var(--bg-1);
	text-align: center;
	color: var(--text-0);
  padding: 1rem 0;
  box-shadow: 0 -2px 4px var(--shadow);
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

nav,
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--text-0);
}


button {
  &,
  &:hover,
  &:active {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    color: var(--text);
    padding: 0;
  }
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

details {
  summary {
    user-select: none;
  }

  &::details-content {
    overflow: clip;
    height: 0;
    transition:
      height 300ms ease,
      border 300ms ease,
      content-visibility 300ms ease allow-discrete;
  }

  &[open] {
    &::details-content {
      height: auto;
    }
  }
}
</style>
