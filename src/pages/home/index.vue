<template>
	<div class="home">
		<div class="chart-list">
			<home-header />
			<div style="padding: 0 8px" class="chart-content">
				<!-- 整体布局 左 中 右 -->
				<a-row :gutter="[8, 8]" style="height: 100%">
					<!-- 左侧 -->
					<a-col :span="7">
						<a-row class="chart-content-left">
							<a-col class="chart-content-left-item" :span="24">
								<ModuleItem title="Github指数">
									<list-header :titleList="['项目名', '影响力', '发展趋势', '社区反应', '开发活跃度', 'Github指数']" />
									<!-- <virtual-list
										:data-source="dataSource"
										:loading="loading"
										:estimated-height="10"
										@scroll-end="addData"
									>
										<template #item="{ item }">
											<div class="list-item" style="color: #ffffff">{{ item.id }} - {{ item.content }}</div>
										</template>
									</virtual-list> -->
								</ModuleItem>
							</a-col>
							<a-col class="chart-content-left-item" :span="24">
								<ModuleItem title="OpenRank">
									<div :ref="openRankChart.container" class="chart-container"></div>
								</ModuleItem>
							</a-col>
						</a-row>
					</a-col>
					<!-- 中间 -->
					<a-col :span="10">
						<a-row class="chart-content-center">
							<a-col class="chart-content-center-item" :span="24">
								<ModuleItem />
							</a-col>
							<a-col class="chart-content-center-item" :span="24">
								<ModuleItem />
							</a-col>
						</a-row>
					</a-col>
					<!-- 右侧 -->
					<a-col :span="7">
						<a-row class="chart-content-right">
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem title="审阅者效率">
									<div :ref="reviewEfficient.container" class="chart-container" />
								</ModuleItem>
								<a-button @click="handleClick">点击</a-button>
							</a-col>
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem />
							</a-col>
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem />
							</a-col>
						</a-row>
					</a-col>
				</a-row>
				<!-- 背景地球 -->
				<earth-bg />
			</div>
		</div>
	</div>
	<!-- 审阅者弹窗 -->
	<chart-modal
		v-model:visible="chartModalData.visible"
		:type="chartModalData.type"
		:defaultValue="chartModalData.selectValue"
	/>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { debounce } from 'lodash';
import HomeHeader from './components/home-header/index.vue';
import EarthBg from './components/earth-bg/index.vue';
import ChartModal from './components/chart-modal/index.vue';
import ListHeader from './components/list-header/index.vue';

import useOpenRank from './composables/use-open-rank';
import useReviewEfficient from './composables/use-review-efficient';
import useChartModal from './composables/use-chart-modal';

const chartModalData = useChartModal();
const openRankChart = useOpenRank();
const reviewEfficient = useReviewEfficient(chartModalData.changeVisible);

const loading = ref(false);
const dataSource = ref<{ id: number; content: string }[]>([]);
const addData = () => {
	loading.value = true;
	setTimeout(() => {
		const newData = [];
		for (let i = 0; i < 20; i++) {
			const len: number = dataSource.value.length + newData.length;
			newData.push({
				id: len,
				content: 'test' // 内容
			});
		}
		dataSource.value = [...dataSource.value, ...newData];
		loading.value = false;
	}, 2000);
};
/**
 * @description 处理全部图表的缩放
 */
const chartResize = debounce(() => {
	openRankChart.chart.resizeChart();
	reviewEfficient.chart.resizeChart();
}, 500);

const handleClick = () => {
	// reviewEfficient.chart.visible = true;
	// (reviewEfficient.chart.lastSeries as any).push(
	// 	{
	// 		name: 'b',
	// 		type: 'line',
	// 		yAxisIndex: 1,
	// 		color: '#ff6e76',
	// 		tooltip: {
	// 			valueFormatter: function (value) {
	// 				return value + ' °C';
	// 			}
	// 		},
	// 		data: [6, 9, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
	// 	},
	// 	{
	// 		name: 'b1',
	// 		type: 'line',
	// 		yAxisIndex: 1,
	// 		color: '#ff6e76',
	// 		tooltip: {
	// 			valueFormatter: function (value) {
	// 				return value + ' °C';
	// 			}
	// 		},
	// 		data: [5, 17, 3.3, 20, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
	// 	},
	// 	{
	// 		name: 'b2',
	// 		type: 'line',
	// 		yAxisIndex: 1,
	// 		color: '#ff6e76',
	// 		tooltip: {
	// 			valueFormatter: function (value) {
	// 				return value + ' °C';
	// 			}
	// 		},
	// 		data: [18, 16, 3.3, 16, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
	// 	}
	// );
	// const option = reviewEfficient.chart.getOption();
	// reviewEfficient.chartRef.value?.setOption(option);
};

onMounted(() => {
	addData();
	nextTick(() => {
		openRankChart.chart.initChart([]);
		reviewEfficient.chart.initChart([]);
	});
	window.addEventListener('resize', chartResize);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', chartResize);
});
</script>

<style lang="scss" scoped>
::v-deep .tooltip-review {
	.tooltip-value {
		font-size: 15px;
		font-weight: bold;
		color: #666666;
	}
}

.home {
	position: relative;
	width: 100%;
	height: 100%;
	background: url('@/assets/images/index-bg.png') no-repeat;
	background-size: 100% 100%;

	.chart-list {
		height: 100%;

		.chart-content {
			height: calc(100% - 77px);

			// position: relative;
			// z-index: 2;
			margin-top: 12px;

			.chart-container {
				width: 100%;
				height: 100%;
			}

			&-left {
				flex-direction: column;
				row-gap: 8px !important;
				height: 100%;

				&-item:nth-child(1) {
					flex: 2;
				}

				&-item:nth-child(2) {
					flex: 1;
				}
			}

			&-center {
				flex-direction: column;
				row-gap: 8px !important;
				height: 100%;
				border-radius: 27px;
				border-image-source: url('@/assets/images/center.png');
				border-image-slice: 27 27 27 27;
				border-image-width: 27px 27px 27px 27px;

				&-item:nth-child(1) {
					flex: 2;
				}

				&-item:nth-child(2) {
					flex: 1;
				}
			}

			&-right {
				flex-direction: column;
				row-gap: 8px !important;
				height: 100%;

				&-item {
					flex: 1;
				}
			}
		}

		@media (max-width: 600px) {
			.chart-content {
				height: calc(100% - 82px);
			}
		}

		@media (max-width: 450px) {
			.chart-content {
				height: calc(100% - 92px);
			}
		}
	}
}
</style>
