<template>
	<div class="list-header">
		<div class="list-header-title" v-for="item in titleList" :key="item.label" :style="{ width: item.width }">
			<a-tooltip color="rgba(73, 146, 255, 0.8)">
				<template #title>
					{{ item.label }}
				</template>
				{{ item.label }}
			</a-tooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { TitltListItem } from '../../data';

defineProps({
	titleList: {
		type: Array as PropType<TitltListItem[]>,
		required: true
	}
});
</script>
<style lang="scss" scoped>
.list-header {
	display: flex;
	gap: 8px;
	align-items: center;
	padding-top: 8px;

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
