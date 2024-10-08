<script setup>
import { ref, watch } from "vue";

const props = defineProps(["metadata"]);
const metadata = ref(props.metadata);

// Watch for changes in the props.metadata and update the local metadata ref
watch(() => props.metadata, (newMetadata) => {
    metadata.value = newMetadata;
});
</script>

<template> 
	<div id="metadata-box">
		<h3>Output from Grasshopper:</h3>     
		<div class="shadow-border">
				<div class="metadata">
						<p v-for="(item, index) in metadata" :key="index">{{ item.value }}</p>
				</div>
		</div>
	</div>
</template>

<style scoped>
#metadata-box {
    padding-top: 20px;
}

.metadata {
    font-style: italic;
}
</style>
