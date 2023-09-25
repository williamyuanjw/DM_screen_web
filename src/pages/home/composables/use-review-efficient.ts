import { ref, reactive, shallowRef } from 'vue';
import echarts from '@/echarts';
import { PieSeriesOption, EChartsOption } from 'echarts';
import { EChartsCoreOption, EChartsType } from 'echarts/core';
import type { DateItem, LineChartType, MuSelectValueType } from '../data';

import { getHtmlFontPX, handleChartResize } from '@/utils/base';
import ThemeColor from '@/themeColor';
import { colorList, dateList } from '../config';

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
					let resStr: string = `
						<div>${params[0].axisValueLabel}</div>
						<div> (reviews | days)</div>
					`;
					let i = 0;
					while (i < params.length) {
						resStr += `
						<div class="tooltip-item">
							<div class="tooltip-label-icon">
								<div class="tooltip-icon" style="background-color: ${params[i].color}"></div>
								<div class="tooltip-label">${params[i].seriesName}：</div>
							</div>
							<span class="tooltip-value">${params[i].value[1]} | ${params[i + 1].value[1]}</span>
						</div>`;
						i += 2;
					}

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
				top: window.innerWidth > 576 ? '12%' : '23%',
				left: '5%',
				right: '5%',
				bottom: '5%',
				containLabel: true
			},
			dataZoom: [
				{
					type: 'inside',
					start: 50,
					end: 100,
					zoomLock: true
				}
			],
			toolbox: {
				right: !showHandler ? '2%' : '3%',
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
					// myRestore: {
					// 	title: 'restore',
					// 	icon: 'path://M512 981.333333c-209.866667 0-396.693333-126.026667-466.293333-314.08a35.52 35.52 0 0 1 23.626666-44.426666 38.613333 38.613333 0 0 1 48 20.693333c58.666667 158.933333 217.013333 265.493333 394.666667 265.6s336-106.666667 394.666667-266.133333a37.6 37.6 0 0 1 28.853333-23.626667 38.986667 38.986667 0 0 1 35.786667 11.946667 34.773333 34.773333 0 0 1 7.146666 35.36c-69.386667 188.373333-256.48 314.666667-466.453333 314.666666z m431.36-574.08a37.92 37.92 0 0 1-35.946667-24.266666C849.386667 222.56 690.613333 114.88 512 114.72S174.72 222.346667 116.746667 382.773333A38.72 38.72 0 0 1 69.333333 403.733333a35.786667 35.786667 0 0 1-24.106666-44.373333C113.333333 169.866667 301.013333 42.666667 512 42.666667s398.666667 127.306667 467.146667 316.96a34.56 34.56 0 0 1-4.906667 32.64 38.933333 38.933333 0 0 1-30.88 14.986666z',
					// 	onclick: () => handleRestore()
					// },
					myModal: !showHandler
						? {}
						: {
								title: '详情',
								icon: 'M391.2 348.6L166.6 124.1h107.6c16.6 0 30-13.4 30-30s-13.4-30-30-30H93.6c-16.3 0.3-29.4 13.6-29.4 30v180c0 16.6 13.4 30 30 30s30-13.4 30-30V166.5l224.6 224.6c11.7 11.7 30.7 11.7 42.4 0 11.7-11.8 11.7-30.8 0-42.5zM348.8 632.8L124.2 857.3V749.7c0-16.6-13.4-30-30-30s-30 13.4-30 30v180.6c0.3 16.3 13.6 29.4 30 29.4h180c16.6 0 30-13.4 30-30s-13.4-30-30-30H166.6l224.6-224.6c11.7-11.7 11.7-30.7 0-42.4-11.7-11.6-30.7-11.6-42.4 0.1zM675.6 391.1l224.6-224.6v107.6c0 16.6 13.4 30 30 30s30-13.4 30-30V93.5c-0.3-16.3-13.6-29.4-30-29.4h-180c-16.6 0-30 13.4-30 30s13.4 30 30 30h107.6L633.2 348.6c-11.7 11.7-11.7 30.7 0 42.4 11.7 11.8 30.7 11.8 42.4 0.1zM633.2 675.2l224.6 224.6H750.2c-16.6 0-30 13.4-30 30s13.4 30 30 30h180.6c16.3-0.3 29.4-13.6 29.4-30v-180c0-16.6-13.4-30-30-30s-30 13.4-30 30v107.6L675.6 632.8c-11.7-11.7-30.7-11.7-42.4 0s-11.7 30.7 0 42.4z',
								onclick: (_params: any, _class: any, _name: any, e: any) => {
									// 移动端要取消默认行为不然弹窗会立刻关闭
									// 阻止touchend后的click事件发生
									e.event.preventDefault();
									showHandler && showHandler(true, 1, chart.selectValue);
								}
						  }
				}
			},

			xAxis: [
				{
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
				}
			],
			yAxis: [
				{
					name: 'reviews',
					max: 2500,
					type: 'value',
					interval: 500,
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
				},
				{
					name: 'days(h)',
					nameLocation: 'start',
					min: 0,
					max: 250,
					interval: 50,
					type: 'value',
					inverse: true,
					axisLabel: {
						fontSize: getHtmlFontPX(0.75)
					},
					splitLine: {
						show: false
					},
					nameTextStyle: {
						fontSize: getHtmlFontPX(0.75)
					}
				}
			],
			series: []
		};
		// 浅合并
		return Object.assign(option, chart.extraOption);
	}

	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	function initChart(nodes: PieSeriesOption['data']): any {
		if (!container.value) return;

		const reviewData: EChartsCoreOption[] = [];
		nodes &&
			nodes.forEach((item: any) => {
				const reviewsArr: DateItem = [];
				const timeArr: DateItem = [];
				dateList.forEach(key => {
					reviewsArr.push([key, item['pr_reviews'][key] || 0]);
				});
				dateList.forEach(key => {
					timeArr.push([key, item['pr_response_time'][key] || 0]);
				});
				const reviewsObj = {
					name: item.name,
					type: 'bar',
					symbol: 'circle',
					smooth: true,
					symbolSize: 8,
					showSymbol: false,
					data: reviewsArr
				};
				const timeObj = {
					name: item.name,
					yAxisIndex: 1,
					type: 'line',
					symbol: 'circle',
					smooth: true,
					symbolSize: 8,
					areaStyle: {
						opacity: 0.4
					},
					showSymbol: false,
					data: timeArr
				};
				reviewData.push(reviewsObj, timeObj);
			});

		const option = getOption();
		option.series = reviewData;
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
