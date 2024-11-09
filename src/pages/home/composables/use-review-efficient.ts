import { ref, reactive, shallowRef } from 'vue';
import echarts from '@/echarts';
import { PieSeriesOption } from 'echarts';
import { EChartsType } from 'echarts/core';
import type { LineChartType, MuSelectValueType } from '../data';

import { handleChartResize, handleTimerType } from '@/utils/base';
import { getCommits } from '../service';
import { message } from 'ant-design-vue';
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
				data: ['2024-12-1', '2024-12-1', '2024-12-1', '2024-12-1', '2024-12-1', '2024-12-1', '2024-12-1']
			},
			tooltip: {
				formatter: function (name) {

					return `commit：${name.value}`
				}
			},
			yAxis: {
				type: 'value'
			},
			series: {
				data: [],
				type: 'line'
			}
		};
		return Object.assign(option, chart.extraOption);
	}
	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	async function initChart(node:any): Promise<void> {
		if (!container.value) return;
		const option = getOption();
		try {
			let map = node.data.columnDate.map(v => handleTimerType(v));
			option.xAxis.data = map
			option.series.data = node.data.commit;
		} catch (error) {
			message.error(error as unknown as string);
		}
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
	function resizeChart(): void {
		if (chartRef.value) {
			initChart(null);
			handleChartResize(chartRef.value);
			resetFontSize();
		}
	}

	/**
	 * @description 自定义toolbox restore方法
	 */
	function handleRestore() {
		const option = getOption();
		if (chartRef.value) {
			chartRef.value.clear();
			chartRef.value.setOption(option);
		}
	}

	return {
		chart,
		container,
		chartRef,
		getOption
	};
}
