import { defineStore } from 'pinia';

import { ref } from 'vue';

export const useStore = defineStore('usestore', () => {
  const idk = ref()

  return { idk };
});
