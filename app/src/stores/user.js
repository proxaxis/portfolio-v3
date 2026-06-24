import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const lastPageIndex = ref(0);
  const isGoingTop = ref(false);

  return { lastPageIndex, isGoingTop };
});
