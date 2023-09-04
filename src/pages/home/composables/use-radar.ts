import { ref, reactive, shallowRef } from 'vue';
import echarts from '@/echarts';
import { PieSeriesOption, EChartsOption } from 'echarts';
import { EChartsType } from 'echarts/core';
import type { RadarChartType } from '../data';

import { getHtmlFontPX, handleChartResize } from '@/utils/base';
import { colorList } from '../config';
import ThemeColor from '@/themeColor';

export default function (): RadarChartType {
	const chartRef = shallowRef<EChartsType>();
	const container = ref<HTMLDivElement | undefined>();
	const chart = reactive<RadarChartType['chart']>({
		selectValue: [],
		initChart,
		resizeChart
	});

	/**
	 * @returns 返回option配置
	 */
	function getOption() {
		const option: EChartsOption = {
			tooltip: {
				trigger: 'item',
				className: 'tooltip-review',
				position: function (pos, _params, _dom, _rect, size) {
					// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					let obj: any = { top: 60 };
					obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
					return obj;
				},
				textStyle: {
					fontSize: getHtmlFontPX(0.75)
				}
			},
			radar: {
				axisName: {
					color: ThemeColor.chartFontColor
				},
				indicator: [
					{ name: 'Sales', max: 6500 },
					{ name: 'Administration', max: 16000 },
					{ name: 'Information Technology', max: 30000 },
					{ name: 'Customer Support', max: 38000 },
					{ name: 'Development', max: 52000 },
					{ name: 'Marketing', max: 25000 }
				]
			},
			series: [
				{
					emphasis: {
						lineStyle: {
							width: 4
						}
					},
					color: colorList,
					name: 'Budget vs spending',
					type: 'radar',
					data: [
						{
							value: [4200, 3000, 20000, 35000, 50000, 18000],
							name: 'Allocated Budget',
							areaStyle: { opacity: 0.2 }
						},
						{
							value: [5000, 14000, 28000, 26000, 42000, 21000],
							name: 'Actual Spending',
							areaStyle: { opacity: 0.2 }
						},
						{
							value: [5000, 2000, 3000, 26000, 42000, 21000],
							name: 'Actual 22',
							areaStyle: { opacity: 0.2 }
						}
					]
				}
			]
		};
		return option;
	}

	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	function initChart(nodes: PieSeriesOption['data']): any {
		console.log(nodes, container.value, 'r');
		if (!container.value) return;
		const option = getOption();
		chartRef.value = echarts.init(container.value);
		chartRef.value && chartRef.value.setOption(option);
		console.log(chartRef.value);
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

	return {
		chart,
		container,
		chartRef,
		getOption
	};
}
