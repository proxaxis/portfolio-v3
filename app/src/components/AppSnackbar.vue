<script setup>
import { onUnmounted, ref } from 'vue';

const isVisible = ref(false);
const text = ref('');
const tone = ref('message');
let hideTimer = null;

function clearHideTimer() {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

function close() {
  clearHideTimer();
  isVisible.value = false;
}

function show(nextText, nextTone = 'message', duration) {
  clearHideTimer();

  text.value = nextText;
  tone.value = nextTone;
  isVisible.value = true;

  const autoHideMs = duration ?? (nextTone === 'alert' ? 3200 : 2200);
  if (autoHideMs > 0) {
    hideTimer = setTimeout(() => {
      isVisible.value = false;
      hideTimer = null;
    }, autoHideMs);
  }
}

function message(nextText, duration) {
  show(nextText, 'message', duration);
}

function alert(nextText, duration) {
  show(nextText, 'alert', duration);
}

defineExpose({
  message,
  alert,
  close,
})

onUnmounted(() => {
  clearHideTimer();
});
</script>

<template>
  <Transition name="snackbar-fade">
    <div v-if="isVisible" class="app-snackbar" :class="{ 'is-alert': tone === 'alert' }" role="status" aria-live="polite">
      {{ text }}
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as var;

.app-snackbar {
  position: fixed;
  left: 1rem;
  bottom: 1rem;
  z-index: 1200;
  max-width: min(90vw, 440px);
  padding: 0.7rem 0.95rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border);
  background: var(--bg-1);
  color: var(--text-0);
  box-shadow: 0 6px 14px var(--shadow);
  font-size: 0.95rem;
  line-height: 1.45;
  word-break: break-word;

  &.is-alert {
    border-color: var(--danger);
    background: var(--danger);
    color: #fff;
  }
}

.snackbar-fade-enter-active,
.snackbar-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.snackbar-fade-enter-from,
.snackbar-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
