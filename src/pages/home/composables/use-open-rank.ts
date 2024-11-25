import { ref, reactive, shallowRef } from 'vue';
import echarts from '@/echarts';

import { EChartsType } from 'echarts/core';
import type { LineChartType, MuSelectValueType } from '../data';
import { handleChartResize, handleTimerType } from '@/utils/base';

export default function (props?: {
	showHandler?: (visible: boolean, type: number, selectValue: MuSelectValueType) => void;
	type?: number;
}): LineChartType {
	const chartRef = shallowRef<EChartsType>();
	const container = ref<HTMLDivElement | undefined>();
	const chart = reactive<LineChartType['chart']>({
		selectValue: [4, 8, 9],
		initChart,
		resizeChart,
		extraOption: {}
	});

	/**
	 * @returns 返回option配置
	 */
	function getOption(time: Array<string>) {
		let option;
		const colors = ['#5470C6', '#9370DB', '#EE6666'];
		if (props?.type === 5) {
			option = {
				color: colors,
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					}
				},
				grid: {
					right: '20%',
					textStyle: {
						color: 'write'
					}
				},
				legend: {
					data: ['日志量', '活跃仓库数量', '活跃账号数量'],
					textStyle: {
						color: 'write'
					}
				},
				xAxis: [
					{
						type: 'category',
						axisTick: {
							alignWithLabel: true
						},
						// prettier-ignore
						data: ['2015', '2016', '2017', '2018', '2019', '2020']
					}
				],
				yAxis: [
					{
						type: 'value',
						name: '活跃仓库数量',
						position: 'right',
						alignTicks: true,
						axisLine: {
							show: true,
							lineStyle: {
								color: colors[0]
							}
						},
						axisLabel: {
							formatter: '{value} M'
						},
						min: function () {
							return 0;
						},
						max: function () {
							return 70;
						},
						interval: 10
					},
					{
						type: 'value',
						name: '活跃账号数量',
						position: 'right',
						alignTicks: true,
						offset: 80,
						axisLine: {
							show: true,
							lineStyle: {
								color: 'write'
							}
						},
						axisLabel: {
							formatter: '{value} M'
						},
						min: function () {
							return 0;
						},
						max: function () {
							return 20;
						},
						interval: 5
					},
					{
						type: 'value',
						name: '日志量',
						position: 'left',
						alignTicks: true,
						gridIndex: 0,
						axisLine: {
							show: true,
							lineStyle: {
								color: colors[2]
							}
						},
						axisLabel: {
							formatter: '{value} M'
						},
						interval: 200
					}
				],
				series: [
					{
						name: '活跃仓库数量',
						type: 'bar',
						data: [15, 25, 30, 35, 40, 55]
					},
					{
						name: '活跃账号数量',
						type: 'bar',
						yAxisIndex: 1,
						data: [4, 7, 9, 10, 12, 16]
					},
					{
						name: '日志量',
						type: 'line',
						yAxisIndex: 2,
						data: [210, 310, 410, 510, 610, 880]
					}
				]
			};
		}
		if (props?.type === 4) {
			option = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						animation: false,
						snap: true
					}
				},
				legend: {
					data: ['Additions', 'Deletions'],
					left: 10,
					textStyle: {
						color: 'write'
					}
				},
				toolbox: {
					feature: {
						dataZoom: {
							yAxisIndex: 'none'
						},
						restore: {},
						saveAsImage: {}
					},
					iconStyle: {
						color: '#000'
					}
				},
				axisPointer: {
					link: [
						{
							xAxisIndex: 'all'
						}
					]
				},
				dataZoom: [
					{
						show: true,
						realtime: true,
						//数据窗口范围的起始百分比。范围是：0 ~ 100。表示 0% ~ 100%。
						start: 30,
						end: 70,
						xAxisIndex: [0, 1]
					},
					{
						type: 'inside',
						realtime: true,
						start: 30,
						end: 70,
						xAxisIndex: [0, 1]
					}
				],
				grid: [
					{
						left: 60,
						right: 50,
						height: '35%'
					},
					{
						left: 60,
						right: 50,
						top: '55%',
						height: '35%'
					}
				],
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						axisLine: { onZero: true },
						data: time
					},
					{
						gridIndex: 1,
						type: 'category',
						boundaryGap: false,
						axisLine: { onZero: true },
						data: time,
						position: 'top'
					}
				],
				yAxis: [
					{
						name: '',
						type: 'value'
					},
					{
						gridIndex: 1,
						name: 'Rainfall(mm)',
						type: 'value',
						inverse: true
					}
				],
				series: [
					{
						name: 'Additions',
						type: 'line',
						symbolSize: 8,
						// prettier-ignore
						data: []
					},
					{
						name: 'Deletions',
						type: 'line',
						xAxisIndex: 1,
						yAxisIndex: 1,
						symbolSize: 8,
						// prettier-ignore
						data: []
					}
				]
			};
		}

		// 浅合并
		return Object.assign(option, {});
	}

	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	function initChart(nodes?: any): any {
		if (!container.value) return;
		let option = {};
		if (props?.type === 5) {
			option = getOption();
		} else if (props?.type === 4) {
			console.log(nodes, 'nodes');
			// 数据格式处理
			let DateTime: Array<string> = [];
			let CommitData: Array<number> = [];
			let deleteData: Array<number> = [];
			nodes.data.forEach((v: { DateTime: string; Additions: number; Deletions: number }) => {
				DateTime.push(handleTimerType(v.DateTime));
				CommitData.push(v.Additions);
				deleteData.push(-v.Deletions);
			});
			option = getOption(DateTime);
			option.series[0].data = CommitData;
			option.series[1].data = deleteData;
		}
		chartRef.value = echarts.init(container.value);
		chartRef.value && chartRef.value.setOption(option);
	}

	/**
	 * @description 重新set一下resize后的字体 不然会有偏移
	 */

	/**
	 * @description 处理图表resize
	 */
	function resizeChart() {
		if (chartRef.value) {
			handleChartResize(chartRef.value);
		}
	}

	return {
		chart,
		container,
		chartRef
	};
}
