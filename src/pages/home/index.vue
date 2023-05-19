<template>
	<div class="home">
		<IssueAndPr v-model:chartValue="IssueAndPrChart" />
		<IssueAndPr v-model:chartValue="testCharts" />
	</div>
</template>

<script setup lang="ts">
import IssueAndPr from '@/components/IssuseAndPr/index.vue';
import _ from 'lodash';
import { shallowRef, onBeforeUnmount, onMounted } from 'vue';
import { EChartsType } from 'echarts/core';

const IssueAndPrChart = shallowRef<EChartsType>();
const testCharts = shallowRef<EChartsType>();
const chartResize = _.throttle(() => {
	IssueAndPrChart.value?.resize && IssueAndPrChart.value?.resize();
	testCharts.value?.resize && testCharts.value?.resize();
}, 300);
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
}
</style>
