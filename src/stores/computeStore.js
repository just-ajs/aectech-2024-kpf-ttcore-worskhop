import { defineStore } from "pinia";

export const useComputeStore = defineStore("computeStore", {
  state: () => {
    return {
      computing: false,
    };
  },
  getters: {},
  setters: {},
});