import { ref, reactive, shallowRef } from 'vue';
import echarts from '@/echarts';
import { PieSeriesOption, EChartsOption } from 'echarts';
import { EChartsType, EChartsCoreOption } from 'echarts/core';
import type { DateItem, LineChartType, MuSelectValueType, intervalMapType } from '../data';

import { getHtmlFontPX, handleChartResize } from '@/utils/base';
import ThemeColor from '@/themeColor';
import { colorList, dateList } from '../config';

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

	const intervalMap: intervalMapType = {
		openrank: {
			interval: 200,
			type: 'line'
		},
		project_attention: {
			interval: 200,
			type: 'bar'
		},
		developer_activity: {
			interval: 30,
			type: 'line'
		},
		project_activity: {
			interval: 400,
			type: 'line'
		}
	};

	/**
	 * @returns 返回option配置
	 */
	function getOption() {
		const option: EChartsOption = {
			color: colorList,
			textStyle: {
				color: ThemeColor.chartFontColor
			},

			tooltip: {
				confine: true,
				axisPointer: {
					lineStyle: {
						width: 2,
						color: '#ffeb7b'
					}
				},
				className: 'tooltip-review',
				formatter: (params: any) => {
					let resStr: string = `<div>${params[0].axisValueLabel}</div>`;
					params.forEach((item: any) => {
						resStr += `
						<div class="tooltip-item">
							<div class="tooltip-label-icon">
								<span class="tooltip-icon" style="background-color: ${item.color}"></span>
								<span class="tooltip-label">${item.seriesName}：</span>
							</div>
							<span class="tooltip-value">${item.value[1]}</span>
						</div>
						`;
					});
					return resStr;
				},
				position: function (pos, _params, _dom, _rect, size) {
					// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					let obj: any = { top: 60 };
					obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
					return obj;
				},
				// 通过坐标轴来触发
				trigger: 'axis',
				textStyle: {
					fontSize: getHtmlFontPX(0.75)
				}
			},
			// containLabel 为 true 的时候：
			// grid.left grid.right grid.top grid.bottom grid.width grid.height 决定的是包括了坐标轴标签在内的所有内容所形成的矩形的位置。
			// 这常用于『防止标签溢出』的场景，标签溢出指的是，标签长度动态变化时，可能会溢出容器或者覆盖其他组件。
			grid: {
				top: '20%',
				left: '5%',
				right: '5%',
				bottom: '5%',
				containLabel: true
			},
			toolbox: {
				right: !props?.showHandler ? '2%' : '3%',
				iconStyle: {
					borderColor: ThemeColor.chartFontColor
				},
				emphasis: {
					iconStyle: {
						borderColor: '#ffeb7b'
					}
				},
				itemGap: Number(getHtmlFontPX(0.25).replace('px', '')),
				itemSize: Number(getHtmlFontPX(0.875).replace('px', '')),
				feature: {
					magicType: { type: ['line', 'bar'] },
					myModal: !props?.showHandler
						? {}
						: {
								title: '详情',
								icon: 'M391.2 348.6L166.6 124.1h107.6c16.6 0 30-13.4 30-30s-13.4-30-30-30H93.6c-16.3 0.3-29.4 13.6-29.4 30v180c0 16.6 13.4 30 30 30s30-13.4 30-30V166.5l224.6 224.6c11.7 11.7 30.7 11.7 42.4 0 11.7-11.8 11.7-30.8 0-42.5zM348.8 632.8L124.2 857.3V749.7c0-16.6-13.4-30-30-30s-30 13.4-30 30v180.6c0.3 16.3 13.6 29.4 30 29.4h180c16.6 0 30-13.4 30-30s-13.4-30-30-30H166.6l224.6-224.6c11.7-11.7 11.7-30.7 0-42.4-11.7-11.6-30.7-11.6-42.4 0.1zM675.6 391.1l224.6-224.6v107.6c0 16.6 13.4 30 30 30s30-13.4 30-30V93.5c-0.3-16.3-13.6-29.4-30-29.4h-180c-16.6 0-30 13.4-30 30s13.4 30 30 30h107.6L633.2 348.6c-11.7 11.7-11.7 30.7 0 42.4 11.7 11.8 30.7 11.8 42.4 0.1zM633.2 675.2l224.6 224.6H750.2c-16.6 0-30 13.4-30 30s13.4 30 30 30h180.6c16.3-0.3 29.4-13.6 29.4-30v-180c0-16.6-13.4-30-30-30s-30 13.4-30 30v107.6L675.6 632.8c-11.7-11.7-30.7-11.7-42.4 0s-11.7 30.7 0 42.4z',
								onclick: (_params: any, _class: any, _name: any, e: any) => {
									// 移动端要取消默认行为不然弹窗会立刻关闭
									// 阻止touchend后的click事件发生
									e.event.preventDefault();
									props.showHandler && props.showHandler(true, props.type, chart.selectValue);
								}
						  }
				}
			},
			dataZoom: [
				{
					type: 'inside',
					start: 50,
					end: 100,
					zoomLock: true
				}
			],
			xAxis: {
				type: 'category',
				axisLabel: {
					fontSize: getHtmlFontPX(0.75)
				},
				axisLine: {
					lineStyle: {
						color: ThemeColor.chartFontColor
					}
				},
				axisTick: {
					show: false
				}
			},
			series: []
		};
		// 浅合并
		return Object.assign(option, chart.extraOption);
	}

	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	function initChart(nodes: PieSeriesOption['data'], type: keyof intervalMapType): any {
		if (!container.value) return;
		const openRankData: EChartsCoreOption[] = [];
		nodes &&
			nodes.forEach((item: any) => {
				const data: DateItem = [];
				dateList.forEach(key => {
					data.push([key, item[type][key] || 0]);
				});
				const obj = {
					name: item.name,
					type: intervalMap[type].type,
					symbol: 'circle',
					smooth: true,
					symbolSize: 8,
					showSymbol: false,
					data
				};
				openRankData.push(obj);
			});
		chart.extraOption = {
			...chart.extraOption,
			yAxis: {
				type: 'value',
				interval: intervalMap[type].interval,
				axisLabel: {
					fontSize: getHtmlFontPX(0.75)
				},
				nameTextStyle: {
					fontSize: getHtmlFontPX(0.75)
				},
				splitLine: {
					lineStyle: {
						color: ThemeColor.chartFontColor
					}
				}
			}
		};
		const option = getOption();
		option.series = openRankData;
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
		chartRef,
		getOption
	};
}
