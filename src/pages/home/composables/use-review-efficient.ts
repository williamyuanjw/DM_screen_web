import { ref, reactive, shallowRef } from 'vue';
import echarts from '@/echarts';
import { PieSeriesOption, EChartsOption } from 'echarts';
import { EChartsType } from 'echarts/core';
import type { LineChartType, MuSelectValueType } from '../data';

import { handleChartResize } from '@/utils/base';

export default function (
	showHandler?: (visible: boolean, type: number, selectValue: MuSelectValueType) => void
): LineChartType {
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
	function getOption() {
		// 浅合并
	 const option = {
			xAxis: {
				type: 'category',
				data: ['2024/7/21', '2024/7/22', '2024/7/23', '2024/7/25', '2024/9/21', '2024/7/21', '2024/12/21', '2024/7/23', '2024/7/25', '2024/9/21', '2024/7/21', '2024/12/21']
			},
			tooltip: {
				formatter: function (name) {
					return `commit：${name.value}`;
				}
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					data: [9, 28, 82, 38, 17, 17, 45, 23, 28, 21, 9, 26, 14, 3],
					type: 'line'
				}
			]
		};
		return Object.assign(option, chart.extraOption);
	}

	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	function initChart(nodes: PieSeriesOption['data']): any {
		if (!container.value) return;
		// 请求成功后接收到的数据 处理
		// const reviewData: EChartsCoreOption[] = [];
		// nodes &&
		// 	nodes.forEach((item: any) => {
		// 		const reviewsArr: DateItem = [];
		// 		const timeArr: DateItem = [];
		// 		dateList.forEach(key => {
		// 			reviewsArr.push([key, item['pr_reviews'][key] || 0]);
		// 		});
		// 		dateList.forEach(key => {
		// 			timeArr.push([key, item['pr_response_time'][key] || 0]);
		// 		});
		// 		const reviewsObj = {
		// 			name: item.name,
		// 			type: 'bar',
		// 			symbol: 'circle',
		// 			smooth: true,
		// 			symbolSize: 8,
		// 			showSymbol: false,
		// 			data: reviewsArr
		// 		};
		// 		const timeObj = {
		// 			name: item.name,
		// 			yAxisIndex: 1,
		// 			type: 'line',
		// 			symbol: 'circle',
		// 			smooth: true,
		// 			symbolSize: 8,
		// 			areaStyle: {
		// 				opacity: 0.4
		// 			},
		// 			showSymbol: false,
		// 			data: timeArr
		// 		};
		// 		reviewData.push(reviewsObj, timeObj);
		// 	});
		const option = getOption();
		// option.series = reviewData;
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
			handleChartResize(chartRef.value);
			resetFontSize();
		}
	}

	/**
	 * @description 自定义toolbox restore方法
	 */
	// function handleRestore() {
	// 	const option = getOption();
	// 	if (chartRef.value) {
	// 		chartRef.value.clear();
	// 		chartRef.value.setOption(option);
	// 	}
	// }

	return {
		chart,
		container,
		chartRef,
		getOption
	};
}
