<template>
	<div class="scroll-container" ref="scrollRef">
		<div class="scroll-item" v-for="item in list" :key="item">id：{{ item }}</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const scrollRef = ref<HTMLDivElement>();
const list = ref<number[]>([0, 1, 2, 3, 4, 5, 6]);

const loadList = () => {
	const len = list.value.length;
	for (let i = len; i < len + 5; i++) {
		list.value.push(i);
	}
};

onMounted(() => {
	loadList();
	window.addEventListener('resize', () => {
		console.log(scrollRef.value?.offsetHeight);
		console.log(scrollRef.value?.firstChild);
	});
	console.log(window.getComputedStyle(document.documentElement, null).fontSize);
	// console.log(scrollRef.value.clientHeight);
});
</script>

<style scoped lang="scss">
.scroll-container {
	width: 200px;
	height: 300px;
	overflow-y: scroll;
	background: #ffffff;
	.scroll-item {
		color: #000000;
		border-bottom: 1px solid #000000;
	}
}
</style>
