<template>
	<div class="home">
		<div class="chart-list">
			<IssueAndPr v-model:chartValue="IssueAndPrChart" />
			<Radia v-model:chartValue="radiaChart" />
		</div>
	</div>
</template>

<script setup lang="ts">
import IssueAndPr from '@/components/IssuseAndPr/index.vue';
import _ from 'lodash';
import { shallowRef, onBeforeUnmount, onMounted } from 'vue';
import { EChartsType } from 'echarts/core';

const IssueAndPrChart = shallowRef<EChartsType>();
const radiaChart = shallowRef<EChartsType>();
const chartResize = _.throttle(() => {
	IssueAndPrChart.value?.resize && IssueAndPrChart.value?.resize();
	radiaChart.value?.resize && radiaChart.value?.resize();
}, 0);
onMounted(() => {
	window.addEventListener('resize', chartResize);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', chartResize);
});
</script>

<style lang="scss">
.home {
	width: 100%;
	height: 100%;
	.chart-list {
		display: flex;
		height: 100%;
	}
}
</style>
