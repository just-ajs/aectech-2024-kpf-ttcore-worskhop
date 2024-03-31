import { createPinia, defineStore } from "pinia";
import { useComputeStore } from "./computeStore";

const store = useComputeStore(createPinia());
export { store };