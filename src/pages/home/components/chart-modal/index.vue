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
				<div>
					<!-- <a-select
						v-model:value="value"
						mode="multiple"
						style="width: 100%"
						placeholder="Please select"
						:options="[...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }))"
						@change="handleChange"
					></a-select> -->
				</div>
				<div v-if="type === 1" :ref="reviewEfficient.container" class="chart-container" />
			</div>
		</a-modal>
	</div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import useReviewEfficient, { LineChartType } from '../../composables/use-review-efficient';
import { computed, watch, nextTick } from 'vue';
const reviewEfficient = useReviewEfficient();

const props = defineProps({
	visible: {
		type: Boolean,
		required: true
	},
	type: {
		type: Number,
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

function cancel() {
	console.log('cancel');
	// isShow.value = false;
}

function submit() {
	cancel();
}

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
			chartDataObj[props.type].chartRef.value?.clear();
			window.removeEventListener('resize', chartResize);
		}
	}
);
</script>

<style lang="scss" scoped>
.chart-modal-content {
	height: 400px;
	margin-top: 25px;
	color: #ffffff;

	.chart-container {
		width: 100%;
		height: 100%;
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
</style>
