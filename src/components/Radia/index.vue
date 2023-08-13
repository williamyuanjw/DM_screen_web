<template>
	<div class="radiaRef" ref="radiaRef"></div>
</template>

<script setup lang="ts">
import echarts from '@/echarts';
import { EChartsCoreOption, EChartsType } from 'echarts/core';
import { PropType } from 'vue';
import { onMounted, shallowRef } from 'vue';

const props = defineProps({
	chartValue: {
		type: Object as PropType<EChartsType>,
		default: () => {}
	}
});
console.log(props);

const emit = defineEmits(['update:chartValue']);

const option: EChartsCoreOption = {
	title: {
		text: 'Proportion of Browsers',
		subtext: 'Fake Data',
		top: 10,
		left: 10
	},
	tooltip: {
		trigger: 'item'
	},
	legend: {
		type: 'scroll',
		bottom: 10,
		data: (function () {
			let list = [];
			for (let i = 1; i <= 28; i++) {
				list.push(i + 2000 + '');
			}
			return list;
		})()
	},
	visualMap: {
		top: 'middle',
		right: 10,
		color: ['red', 'yellow'],
		calculable: true
	},
	radar: {
		indicator: [
			{ text: 'IE8-', max: 400 },
			{ text: 'IE9+', max: 400 },
			{ text: 'Safari', max: 400 },
			{ text: 'Firefox', max: 400 },
			{ text: 'Chrome', max: 400 }
		]
	},
	series: (function () {
		let series = [];
		for (let i = 1; i <= 28; i++) {
			series.push({
				type: 'radar',
				symbol: 'none',
				lineStyle: {
					width: 1
				},
				emphasis: {
					areaStyle: {
						color: 'rgba(0,250,0,0.3)'
					}
				},
				data: [
					{
						value: [(40 - i) * 10, (38 - i) * 4 + 60, i * 5 + 10, i * 9, (i * i) / 2],
						name: i + 2000 + ''
					}
				]
			});
		}
		return series;
	})()
};

const radiaRef = shallowRef<HTMLDivElement>();

const initCharts = () => {
	if (!radiaRef.value) return;
	const chart = echarts.init(radiaRef.value, 'dark');
	emit('update:chartValue', chart);
	chart.setOption(option);
};

onMounted(() => {
	initCharts();
});
</script>

<style lang="scss">
.radiaRef {
	width: 100%;
	height: 100%;
}
</style>
