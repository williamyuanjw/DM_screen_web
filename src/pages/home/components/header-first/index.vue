<template>
	<div class="header-first">
		<IssueAndPr class="col1" v-model:chartValue="IssueAndPrChart" />
		<Radia class="col2" v-model:chartValue="radiaChart" />
	</div>
</template>

<script setup lang="ts">
import IssueAndPr from '@/components/IssuseAndPr/index.vue';
import Radia from '@/components/Radia/index.vue';
import { EChartsType } from 'echarts/core';
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { debounce } from 'lodash';

const IssueAndPrChart = shallowRef<EChartsType>();
const radiaChart = shallowRef<EChartsType>();

const chartResize = debounce(() => {
	IssueAndPrChart.value?.resize && IssueAndPrChart.value?.resize();
	radiaChart.value?.resize && radiaChart.value?.resize();
}, 500);

onMounted(() => {
	window.addEventListener('resize', chartResize);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', chartResize);
});
</script>

<style lang="scss" scoped>
.header-first {
	display: flex;
	justify-content: space-between;
	width: 100%;
	min-width: 600px;
	height: 300px;
	.col1 {
		width: 30%;
	}
	.col2 {
		width: 30%;
	}
}
</style>
