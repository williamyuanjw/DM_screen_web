import { ref, reactive, shallowRef } from 'vue';
import echarts from '@/echarts';
import { EChartsType } from 'echarts/core';
import type { LineChartType } from '../data';
import { handleChartResize, handleTimerType } from '@/utils/base';
import { message } from 'ant-design-vue';
export default function (props): LineChartType {
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
				data: []
			},
			tooltip: {
				formatter: function (name:any) {
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
	 */
	async function initChart(node:any): Promise<void> {
		if (!container.value) return;
		const option = getOption();
		try {
			option.xAxis.data = node.data.columnDate.map((v:string) => handleTimerType(v));
			option.series.data = node.data.commit;
		} catch (error) {
			if(error instanceof Error) {
				message.error(error.message);
			}else {
				console.error('An unknown error occurred:', error);
			}
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
	async function resizeChart()		 {
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
		resizeChart,
		getOption
	};
}
