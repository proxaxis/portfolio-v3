<script setup>
const props = defineProps({
  text: {
    type: String,
    default: null,
  },
});
</script>

<template>
	<div class="loading-spinner">
		<div class="spinner"></div>
		<p v-if="text">{{ text }}</p>
	</div>
</template>

<style lang="scss" scoped>
.loading-spinner {
	margin: 30vh 0;

	.spinner {
		margin: 2rem auto;
		border: 4px solid #f3f3f3;
		border-top: 4px solid var(--accent);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
	}
  
	p {
		text-align: center;
	}
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>