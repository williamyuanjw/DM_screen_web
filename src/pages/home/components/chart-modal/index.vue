<template>
	<div class="chart-modal">
		<a-modal
			wrapClassName="chart-modal-wrap"
			width="60%"
			v-model:visible="isShow"
			@ok="submit"
			:closable="false"
			@cancel="cancel"
			:footer="null"
		>
			<div class="chart-modal-content">
				<div class="chart-modal-first">
					<a-select
						class="chart-modal-select"
						dropdownClassName="chart-select-drop"
						v-model:value="selectValue"
						mode="multiple"
						style="width: 40%"
						placeholder="请选择"
						:options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
						@change="handleChange"
					></a-select>
				</div>
				<div v-if="type === 1" :ref="reviewEfficient.container" class="chart-container" />
			</div>
		</a-modal>
	</div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, PropType, ref } from 'vue';
import { debounce } from 'lodash';

import useReviewEfficient, { LineChartType } from '../../composables/use-review-efficient';
import { MuSelectValueType } from '../../data';

const reviewEfficient = useReviewEfficient();

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
		console.log('value');
		emit('update:visible', value);
	}
});

const selectValue = ref<MuSelectValueType>([]);

function cancel() {
	console.log('cancel');
	// isShow.value = false;
}

function submit() {
	cancel();
}

const handleChange = (value: any) => {
	console.log(value, selectValue.value, 'change');
};

const chartResize = debounce(() => {
	reviewEfficient.chart.resizeChart();
}, 500);

const initChartOptions = () => {
	reviewEfficient.chart.extraOption = {
		title: {
			text: 'Reviewer efficiency',
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
				start: 0,
				end: 120,
				zoomLock: true
			}
		]
	};
};

const chartDataObj: Record<string, LineChartType> = {
	1: reviewEfficient
};

watch(
	() => props.visible,
	value => {
		if (value) {
			nextTick(() => {
				console.log(props.type);
				initChartOptions();
				chartDataObj[props.type].chart.initChart([]);
			});
			window.addEventListener('resize', chartResize);
		} else {
			selectValue.value && (selectValue.value.length = 0);
			chartDataObj[props.type].chartRef.value?.clear();
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
</script>

<style lang="scss" scoped>
.chart-modal-content {
	display: flex;
	flex-direction: column;
	height: 500px;
	margin-top: 25px;
	overflow: hidden;
	color: #ffffff;

	.chart-container {
		flex: 1;
	}

	.chart-modal-first {
		margin: 16px 0;
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
}
</style>
