import { ref, reactive, Ref, shallowRef } from 'vue';
import echarts from '@/echarts';
import { PieSeriesOption, EChartsOption } from 'echarts';
import { EChartsType } from 'echarts/core';

import { getHtmlFontPX, handleChartResize } from '@/utils/base';
// import ThemeColor from '@/themeColor';

type ChartType = {
	chart: {
		initChart(nodes: PieSeriesOption['data']): void;
		resizeChart(): void;
	};
	container: Ref<HTMLDivElement | undefined>;
	chartRef: Ref<EChartsType | undefined>;
};
export default function (): ChartType {
	const chartRef = shallowRef<EChartsType>();
	const container = ref<HTMLDivElement | undefined>();
	const chart = reactive<ChartType['chart']>({
		initChart,
		resizeChart
	});

	/**
	 * @returns 返回option配置
	 */
	function getOption() {
		const option: EChartsOption = {
			textStyle: {
				color: '#fff'
			},
			tooltip: {
				position: function (pos, params, dom, rect, size) {
					// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					let obj: any = { top: 60 };
					obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
					return obj;
				},
				trigger: 'axis',
				textStyle: {
					fontSize: getHtmlFontPX(0.75)
				},
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					},
					label: {
						fontSize: getHtmlFontPX(0.75)
					}
				}
			},
			// containLabel 为 true 的时候：
			// grid.left grid.right grid.top grid.bottom grid.width grid.height 决定的是包括了坐标轴标签在内的所有内容所形成的矩形的位置。
			// 这常用于『防止标签溢出』的场景，标签溢出指的是，标签长度动态变化时，可能会溢出容器或者覆盖其他组件。
			grid: {
				top: '30%',
				left: '5%',
				right: '5%',
				bottom: '5%',
				containLabel: true
			},
			toolbox: {
				top: '9.5%',
				right: '3%',
				iconStyle: {
					borderColor: '#fff'
				},
				emphasis: {
					iconStyle: {
						borderColor: '#ffeb7b'
					}
				},
				itemGap: Number(getHtmlFontPX(0.25).replace('px', '')),
				itemSize: Number(getHtmlFontPX(0.9375).replace('px', '')),

				feature: {
					magicType: { type: ['line', 'bar'] },
					restore: {}
				}
			},
			// legend: {
			// 	data: ['Evaporation', 'Precipitation', 'Temperature']
			// },
			xAxis: [
				{
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					axisPointer: {
						type: 'shadow'
					},
					axisLabel: {
						fontSize: getHtmlFontPX(0.75)
					}
				}
			],
			yAxis: [
				{
					type: 'value',
					name: 'Precipitation',
					min: 0,
					max: 250,
					interval: 50,
					axisLabel: {
						formatter: '{value} ml',
						fontSize: getHtmlFontPX(0.75)
					},
					nameTextStyle: {
						fontSize: getHtmlFontPX(0.75)
					}
				},
				{
					type: 'value',
					name: 'Temperature',
					min: 0,
					max: 25,
					interval: 5,
					axisLabel: {
						formatter: '{value} °C',
						fontSize: getHtmlFontPX(0.75)
					},
					nameTextStyle: {
						fontSize: getHtmlFontPX(0.75)
					}
				}
			],
			series: [
				{
					name: 'Evaporation',
					type: 'bar',
					tooltip: {
						valueFormatter: function (value) {
							return value + ' ml';
						}
					},
					data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
				},
				{
					name: 'Precipitation',
					type: 'bar',
					tooltip: {
						valueFormatter: function (value) {
							return value + ' ml';
						}
					},
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				},
				{
					name: 'Temperature',
					type: 'line',
					yAxisIndex: 1,
					tooltip: {
						valueFormatter: function (value) {
							return value + ' °C';
						}
					},
					data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
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
		console.log(nodes);
		if (!container.value) return;
		const option = getOption();
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

	return {
		chart,
		container,
		chartRef
	};
}
