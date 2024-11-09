import { ref, reactive, shallowRef } from 'vue';
import { PieSeriesOption, EChartsOption } from 'echarts';
import echarts from '@/echarts';

import { EChartsType } from 'echarts/core';
import type { LineChartType, MuSelectValueType, intervalMapType } from '../data';
import { getHtmlFontPX, handleChartResize, handleTimerType } from '@/utils/base';
import ThemeColor from '@/themeColor';
import { colorList } from '../config';

export default function (props?: {
	showHandler?: (visible: boolean, type: number, selectValue: MuSelectValueType) => void;
	type: number;
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
		let option :EChartsOption= {
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
		// 浅合并
		return Object.assign(option, {});
	}

	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	function initChart(nodes: any): any {
		if (!container.value) return;
		// 数据格式处理
		let DateTime: Array<string> = [];
		let CommitData: Array<number> = [];
		let deleteData: Array<number> = [];
		nodes.data.forEach((v: { DateTime: string; Additions: number; Deletions: number }) => {
			DateTime.push(handleTimerType(v.DateTime));
			CommitData.push(v.Additions);
			deleteData.push(-v.Deletions);
		});
		const option = getOption(DateTime);
		option.series[0].data = CommitData;
		option.series[1].data = deleteData;
		console.log(option);
		chartRef.value = echarts.init(container.value);
		chartRef.value && chartRef.value.setOption(option);
	}

	/**
	 * @description 重新set一下resize后的字体 不然会有偏移
	 */
	function resetFontSize() {
		const option = getOption();
		// 需要重新计算字体不然依旧会有点偏差
		chartRef.value && chartRef.value.setOption(option);
	}

	/**
	 * @description 处理图表resize
	 */
	function resizeChart() {
		if (chartRef.value) {
			initChart(null)
			handleChartResize(chartRef.value);
			resetFontSize();
		}
	}

	return {
		chart,
		container,
		chartRef,
		initChart
	}
}
