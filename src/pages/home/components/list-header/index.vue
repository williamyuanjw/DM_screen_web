<template>
	<div class="list-header">
		<div class="list-header-title" v-for="item in titleList" :key="item">{{ item }}</div>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
	titleList: {
		type: Array as PropType<string[]>,
		required: true
	}
});
</script>
<style lang="scss" scoped>
.list-header {
	display: flex;
	align-items: center;
	justify-content: space-around;
	margin-top: 8px;

	.list-header-title {
		overflow: hidden;
		font-size: 16px;
		color: #558dfd;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}
</style>
