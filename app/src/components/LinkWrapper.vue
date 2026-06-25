<script setup>
import IconArrowUpRightFromSquare from '@/components/icons/IconArrowUpRightFromSquare.vue';
const props = defineProps({
  href: {
    type: String,
    required: true
  },
});
</script>

<template>
  <a class="link-wrapper" :href="props.href" target="_blank" rel="noopener noreferrer">
    <span>
      <slot></slot>
    </span>
    <IconArrowUpRightFromSquare size="1rem" />
  </a>
</template>

<style lang="scss" scoped>
.link-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
}
</style>
