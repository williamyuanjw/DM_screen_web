<template>
	<div class="chart-modal">
		<a-modal wrapClassName="chart-modal-wrap" width="60%" v-model:visible="isShow" :closable="false" :footer="null">
			<div class="chart-modal-content">
				<div class="chart-modal-first">
					<multiple-select
						class="chart-modal-select"
						dropdownClassName="chart-select-drop"
						v-model:value="selectValue"
						mode="multiple"
						style="width: 100%"
						placeholder="请选择"
						:filter-option="false"
						:options="searchOptions"
						@select="handleSelect"
						@deselect="handleDel"
						@search="handleSearch"
					/>
				</div>
				<div :ref="chartDataObj[props.type].container" class="chart-container" />
			</div>
		</a-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, PropType, ref } from 'vue';
import { debounce } from 'lodash';

import { DateItem, MuSelectValueType, chartDataObjType } from '../../data';

import useReviewEfficient from '../../composables/use-review-efficient';
import useOpenRank from '../../composables/use-open-rank';

import useOptionStore from '@/store/option';
import useInitData from '@/store/initData';

import { getProjectData } from '../../service';
import { SelectProps, message } from 'ant-design-vue';
import { dateList } from '../../config';

const reviewEfficient = useReviewEfficient();
const openRankChart = useOpenRank();
const deverChart = useOpenRank();
const attentChart = useOpenRank();
const projectChart = useOpenRank();

const optionStore = useOptionStore();
const initDataStore = useInitData();

const searchOptions = ref<SelectProps['options']>([]);

const props = defineProps({
	visible: {
		type: Boolean,
		required: true
	},
	type: {
		type: Number,
		required: true
	},
	defaultValue: {
		type: Object as PropType<MuSelectValueType>,
		required: true
	}
});
const emit = defineEmits(['update:visible', 'ok']);

const isShow = computed({
	get() {
		return props.visible;
	},
	set(value) {
		emit('update:visible', value);
	}
});

const selectValue = ref<MuSelectValueType>([]);

const chartResize = debounce(() => {
	chartDataObj[props.type].data.chart.resizeChart();
}, 500);

const chartDataObj: chartDataObjType = {
	1: {
		title: 'PR Efficiency',
		data: reviewEfficient,
		container: reviewEfficient.container
	},
	2: {
		title: 'OpenRank',
		key: 'openrank',
		data: openRankChart,
		container: openRankChart.container,
		chartType: 'line'
	},
	3: {
		title: 'Developer Activity',
		key: 'developer_activity',
		data: deverChart,
		container: deverChart.container,
		chartType: 'line'
	},
	4: {
		title: 'Project Attention',
		key: 'project_attention',
		data: attentChart,
		container: attentChart.container,
		chartType: 'bar'
	},
	5: {
		title: 'Project Activity',
		key: 'project_activity',
		data: projectChart,
		container: projectChart.container,
		chartType: 'line'
	}
};

const initChartOptions = () => {
	chartDataObj[props.type].data.chart.extraOption = {
		title: {
			text: chartDataObj[props.type].title,
			textStyle: {
				color: '#ffeb7b',
				fontSize: '1.125rem'
			}
		},
		grid: {
			top: '15%',
			left: '3%',
			right: '3%',
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
		]
	};
};

const handleSelectLine = async (value: number, name: string) => {
	const res = await getProjectData({
		type: chartDataObj[props.type].key as string,
		project_id: value
	});

	if (res.code === 200) {
		const dataArr: DateItem = [];
		dateList.forEach(key => {
			dataArr.push([key, +res.data[key] || 0]);
		});

		const curOptions = chartDataObj[props.type].data.chartRef.value?.getOption();

		let chartType = chartDataObj[props.type].chartType;

		if (curOptions && Array.isArray(curOptions.series)) {
			curOptions.series[0] && (chartType = curOptions.series[0].type);
			const obj = {
				name,
				type: chartType,
				symbol: 'circle',
				smooth: true,
				symbolSize: 8,
				showSymbol: false,
				data: dataArr
			};
			curOptions.series.push(obj);
			chartDataObj[props.type].data.chartRef.value?.setOption(curOptions);
		}
	}
};

const handleSelectPr = async (value: number, name: string) => {
	const promiseArr = [
		getProjectData({
			type: 'pr_reviews',
			project_id: value
		}),
		getProjectData({
			type: 'pr_response_time',
			project_id: value
		})
	];
	Promise.all(promiseArr).then(res => {
		console.log(res);

		const reviewData = [];
		const reviewsArr: DateItem = [];
		const timeArr: DateItem = [];
		dateList.forEach(key => {
			reviewsArr.push([key, res[0].data[key] || 0]);
		});
		dateList.forEach(key => {
			timeArr.push([key, res[1].data[key] || 0]);
		});
		const reviewsObj = {
			name: name,
			type: 'bar',
			symbol: 'circle',
			smooth: true,
			symbolSize: 8,
			showSymbol: false,
			data: reviewsArr
		};
		const timeObj = {
			name: name,
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
		const curOptions = chartDataObj[props.type].data.chartRef.value?.getOption();
		if (curOptions && Array.isArray(curOptions.series)) {
			curOptions.series.push(...reviewData);
			console.log(curOptions);

			chartDataObj[props.type].data.chartRef.value?.setOption(curOptions);
		}
	});
};

const handleSelect = async (value: any, option: any) => {
	if (selectValue.value.length > 5) {
		selectValue.value = selectValue.value.slice(0, 5);
		return message.warning('最多只能选择5个项目');
	}
	props.type === 1 && handleSelectPr(value, option.label);
	props.type !== 1 && handleSelectLine(value, option.label);
};

const handleDel = async (_: any, option: any) => {
	const label = option.label;
	const curOptions = chartDataObj[props.type].data.chartRef.value?.getOption();
	if (curOptions && Array.isArray(curOptions.series)) {
		curOptions.series = curOptions.series.filter(item => item.name !== label);
		chartDataObj[props.type].data.chartRef.value?.setOption(curOptions, true);
	}
};

const handleSearch = debounce(async (value: string) => {
	const option = optionStore.option.filter((item: any) => item.label.indexOf(value) !== -1);
	searchOptions.value = option;
}, 300);

watch(
	() => props.visible,
	value => {
		if (value) {
			nextTick(() => {
				initChartOptions();
				const key = chartDataObj[props.type].key;
				chartDataObj[props.type].data.chart.initChart(initDataStore.list, key);
			});
			window.addEventListener('resize', chartResize);
		} else {
			selectValue.value && (selectValue.value = props.defaultValue);
			chartDataObj[props.type].data.chartRef.value?.clear();
			window.removeEventListener('resize', chartResize);
		}
	}
);

watch(
	() => props.defaultValue,
	value => {
		selectValue.value = value;
	}
);

watch(
	() => optionStore.option,
	value => (searchOptions.value = value)
);
</script>

<style lang="scss" scoped>
.chart-modal-content {
	display: flex;
	flex-direction: column;
	min-height: 450px;
	margin-top: 25px;
	overflow: hidden;
	color: #ffffff;

	.chart-container {
		flex: 1;
	}

	.chart-modal-first {
		margin: 16px 0;
	}

	::v-deep .ant-select {
		color: rgb(255 255 255 / 80%);
	}

	.chart-modal-select {
		::v-deep .ant-select-selector {
			background-color: #3a59a4;
			border-color: #8190b8;

			.ant-select-selection-item {
				color: rgb(255 255 255 / 80%);
				background-color: #4992ff;
				border-color: rgb(255 255 255 / 80%);
			}

			.ant-select-selection-item-remove {
				color: rgb(255 255 255 / 80%);
			}
		}

		&:hover {
			::v-deep .ant-select-selector {
				border-color: #4992ff;
			}
		}
	}
}

// 小屏幕下的样式
@media (max-width: 576px) {
	.chart-modal-select {
		::v-deep .ant-select-selection-item {
			height: 38px;
			line-height: 38px;
		}

		::v-deep .ant-select-selection-item-remove {
			font-size: 22px;
		}
	}
}
</style>

<style lang="scss">
.chart-modal-wrap {
	.ant-modal-content {
		background-color: transparent;
		border-image-source: url('@/assets/images/newForm.png');
		border-image-slice: 50 50 50 50 fill;
		border-image-width: 50px 50px 50px 50px;

		.ant-modal-header {
			background-color: transparent;
		}
	}

	.ant-modal-close {
		color: #ffffff;
	}
}

.chart-select-drop {
	color: rgb(255 255 255 / 60%);
	background-color: #3a59a4;

	.ant-select-item {
		color: rgb(255 255 255 / 60%);
	}

	.ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
		background-color: #4992ff;
	}

	.ant-select-item-option-active:not(.ant-select-item-option-disabled) {
		background-color: #6585d2;
	}

	.ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state {
		color: rgb(255 255 255 / 60%);
	}

	.ant-empty-description {
		color: rgb(255 255 255 / 60%);
	}
}

@media (max-width: 576px) {
	.chart-select-drop {
		.ant-select-item {
			min-height: 2.4rem;
		}
	}
}
</style>
