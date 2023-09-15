import { ref, reactive, shallowRef, watch } from 'vue';
import echarts from '@/echarts';
import { PieSeriesOption, EChartsOption, RadarSeriesOption } from 'echarts';
import { EChartsType } from 'echarts/core';
import type { RadarChartType } from '../data';

import { getHtmlFontPX, handleChartResize } from '@/utils/base';
import { colorList } from '../config';
import ThemeColor from '@/themeColor';
import useGithubStore from '@/store/github';
import { message } from 'ant-design-vue';

export default function (): RadarChartType {
	const githubStore = useGithubStore();

	const chartRef = shallowRef<EChartsType>();
	const container = ref<HTMLDivElement | undefined>();
	const chart = reactive<RadarChartType['chart']>({
		selectValue: [],
		initChart,
		resizeChart,
		addRadarData
	});

	const indicator = [
		{ name: 'Influence' },
		{ name: 'Response' },
		{ name: 'Activity' },
		{ name: 'Trend' },
		{ name: 'GitHub' }
	];
	/**
	 * @returns 返回option配置
	 */
	function getOption() {
		const option: EChartsOption = {
			tooltip: {
				confine: true,
				trigger: 'item',
				triggerOn: 'click',
				enterable: true,
				className: 'tooltip-review',
				position: function (pos, _params, _dom, _rect, size) {
					// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					let obj: any = { top: 60 };
					obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
					return obj;
				},
				textStyle: {
					fontSize: getHtmlFontPX(0.75)
				},
				formatter: (params: any) => {
					let resStr: string = `<div class="tooltip-title">${params.name}</div>`;
					params.value.forEach((item: any, index: number) => {
						resStr += `
						<div class="tooltip-item">
							<div class="tooltip-label-icon">
								<div class="tooltip-icon" style="background-color: ${params.color}"></div>
								<div class="tooltip-label">${indicator[index].name}：</div>
							</div>
							<span class="tooltip-value">${item}</span>
						</div>
						`;
					});
					resStr += `
						<div class="tooltip-btn" id="radar-remove" data-id="${params.name}">remove</div>
					`;
					return resStr;
				}
			},
			color: colorList,
			radar: {
				axisName: {
					color: ThemeColor.chartFontColor,
					fontSize: getHtmlFontPX(0.75)
				},
				indicator: indicator
			},
			series: {
				symbolSize: 10,
				lineStyle: {
					width: 3
				},
				emphasis: {
					lineStyle: {
						width: 5
					}
				},
				type: 'radar',
				data: []
			}
		};
		return option;
	}

	/**
	 * 初始化图表
	 * @param container 图表容器id
	 */
	function initChart(nodes: PieSeriesOption['data']): any {
		if (!container.value) return;

		const radarData: RadarSeriesOption['data'] = [];
		nodes &&
			nodes.forEach((item: any) => {
				chart.selectValue.push(item.project_id);
				const obj = {
					value: [item.influence, item.response, item.activity, item.trend, item.github],
					name: item.name,
					areaStyle: { opacity: 0.4 }
				};
				radarData.push(obj);
			});

		const option = getOption();
		(option.series as RadarSeriesOption).data?.push(...radarData);
		chartRef.value = echarts.init(container.value);
		chartRef.value && chartRef.value.setOption(option);
	}

	/**
	 * @description 重新set一下resize后的字体 不然会有偏移
	 */
	function resetFontSize() {
		const option = getOption();
		delete option.series;
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
	 * @description 雷达图添加
	 */
	function addRadarData(name: string) {
		if (chart.selectValue.includes(name)) {
			return message.warning('不能重复添加');
		}

		if (chart.selectValue.length >= 5) {
			return message.warning('最多添加5项');
		}

		const item = githubStore.list.find(item => item.name === name)!;
		const obj = {
			value: [item.influence, item.response, item.activity, item.trend, item.github],
			name: item.name,
			areaStyle: { opacity: 0.2 }
		};
		const curOptions = chartRef.value?.getOption();

		if (curOptions && Array.isArray(curOptions.series)) {
			chart.selectValue.push(item.name);
			curOptions.series[0].data.push(obj);
			chartRef.value?.setOption(curOptions);
		}
	}

	watch(
		() => chartRef.value,
		() => {
			chartRef.value &&
				chartRef.value.on('showTip', () => {
					document.querySelector('#radar-remove')?.addEventListener('click', e => {
						const name = (e.target as HTMLDivElement).dataset.id;
						const curOptions = chartRef.value?.getOption();
						if (curOptions && Array.isArray(curOptions.series)) {
							const index = chart.selectValue.indexOf(name as string);
							chart.selectValue.splice(index, 1);
							curOptions.series[0].data = curOptions.series[0].data.filter((item: any) => item.name !== name);
							chartRef.value?.setOption(curOptions, true);
						}
					});
				});
		}
	);

	return {
		chart,
		container,
		chartRef,
		getOption
	};
}
