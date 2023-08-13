<template>
	<div class="home">
		<div class="chart-list">
			<!-- <IssueAndPr v-model:chartValue="IssueAndPrChart" />
			<Radia v-model:chartValue="radiaChart" /> -->
			<home-header />
			<header-first />
			<section></section>
			<footer></footer>
		</div>
	</div>
</template>

<script setup lang="ts">
import HomeHeader from './components/home-header/index.vue';
import HeaderFirst from './components/header-first/index.vue';

import { debounce } from 'lodash';
import { shallowRef, onBeforeUnmount, onMounted } from 'vue';

import { EChartsType } from 'echarts/core';

const IssueAndPrChart = shallowRef<EChartsType>();
const radiaChart = shallowRef<EChartsType>();

const chartResize = debounce(() => {
	IssueAndPrChart.value?.resize && IssueAndPrChart.value?.resize();
	radiaChart.value?.resize && radiaChart.value?.resize();
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
	background: url('@/assets/images/index-bg.png') no-repeat;
	background-size: 100% 100%;
}
</style>
