<template>
	<div class="home">
		<div class="chart-list">
			<home-header />
			<div style="padding: 0 8px" class="chart-content">
				<!-- 整体布局 左 中 右 -->
				<a-row :gutter="[8, 8]" style="height: 100%">
					<!-- 左侧 -->
					<a-col :span="7" style="height: 100%">
						<a-row class="chart-content-left">
							<a-col class="chart-content-left-item" :span="24">
								<ModuleItem title="Github指数" :loading="github.loading">
									<div class="virtual-list-content">
										<list-header
											:titleList="['项目名', '影响力', '发展趋势', '社区反应', '开发活跃度', 'Github指数']"
										/>
										<virtual-list
											:data-source="github.dataSource"
											:loading="github.loading"
											:estimated-height="10"
											@scroll-end="github.addData"
											class="virtual-list"
										>
											<template #item="{ item }">
												<div class="virtual-list-item">
													<span class="virtual-list-item-col">{{ item.content }}</span>
													<span class="virtual-list-item-col">{{ item.id }}</span>
													<span class="virtual-list-item-col">{{ item.id }}</span>
													<span class="virtual-list-item-col">{{ item.id }}</span>
													<span class="virtual-list-item-col">{{ item.id }}</span>
													<span class="virtual-list-item-col">{{ item.id }}</span>
												</div>
											</template>
										</virtual-list>
									</div>
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
					<a-col :span="10" style="height: 100%">
						<a-row class="chart-content-center">
							<a-col class="chart-content-center-item" :span="24">
								<ModuleItem>
									<div class="index-data">
										<index-num />
										<radar-list :radarFirst="radarFirst" />
									</div>
								</ModuleItem>
							</a-col>
							<a-col class="chart-content-center-item" :span="24">
								<ModuleItem title="关注度">
									<div :ref="attentChart.container" class="chart-container"></div>
								</ModuleItem>
							</a-col>
						</a-row>
					</a-col>
					<!-- 右侧 -->
					<a-col :span="7" style="height: 100%">
						<a-row class="chart-content-right">
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem title="审阅者效率">
									<div :ref="reviewEfficient.container" class="chart-container" />
								</ModuleItem>
							</a-col>
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem title="开发者活跃度">
									<div :ref="deverChart.container" class="chart-container"></div>
								</ModuleItem>
							</a-col>
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem title="项目活跃度">
									<div :ref="projectChart.container" class="chart-container"></div>
								</ModuleItem>
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
import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { debounce } from 'lodash';
import HomeHeader from './components/home-header/index.vue';
import EarthBg from './components/earth-bg/index.vue';
import ChartModal from './components/chart-modal/index.vue';
import ListHeader from './components/list-header/index.vue';
import IndexNum from './components/index-num/index.vue';
import RadarList from './components/radar-list/index.vue';

import useOpenRank from './composables/use-open-rank';
import useReviewEfficient from './composables/use-review-efficient';
import useChartModal from './composables/use-chart-modal';
import useGithub from './composables/use-github';
import useRadar from './composables/use-radar';

const chartModalData = useChartModal();
const openRankChart = useOpenRank(chartModalData.changeVisible);
const deverChart = useOpenRank(chartModalData.changeVisible);
const attentChart = useOpenRank(chartModalData.changeVisible);
const projectChart = useOpenRank(chartModalData.changeVisible);
const reviewEfficient = useReviewEfficient(chartModalData.changeVisible);
const github = useGithub();
const radarFirst = useRadar();

/**
 * @description 处理全部图表的缩放
 */
const chartResize = debounce(() => {
	openRankChart.chart.resizeChart();
	reviewEfficient.chart.resizeChart();
	radarFirst.chart.resizeChart();
	deverChart.chart.resizeChart();
	attentChart.chart.resizeChart();
	projectChart.chart.resizeChart();
}, 500);

// const handleClick = () => {
// 	// reviewEfficient.chart.visible = true;
// 	// (reviewEfficient.chart.lastSeries as any).push(
// 	// 	{
// 	// 		name: 'b',
// 	// 		type: 'line',
// 	// 		yAxisIndex: 1,
// 	// 		color: '#ff6e76',
// 	// 		tooltip: {
// 	// 			valueFormatter: function (value) {
// 	// 				return value + ' °C';
// 	// 			}
// 	// 		},
// 	// 		data: [6, 9, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
// 	// 	},
// 	// 	{
// 	// 		name: 'b1',
// 	// 		type: 'line',
// 	// 		yAxisIndex: 1,
// 	// 		color: '#ff6e76',
// 	// 		tooltip: {
// 	// 			valueFormatter: function (value) {
// 	// 				return value + ' °C';
// 	// 			}
// 	// 		},
// 	// 		data: [5, 17, 3.3, 20, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
// 	// 	},
// 	// 	{
// 	// 		name: 'b2',
// 	// 		type: 'line',
// 	// 		yAxisIndex: 1,
// 	// 		color: '#ff6e76',
// 	// 		tooltip: {
// 	// 			valueFormatter: function (value) {
// 	// 				return value + ' °C';
// 	// 			}
// 	// 		},
// 	// 		data: [18, 16, 3.3, 16, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
// 	// 	}
// 	// );
// 	// const option = reviewEfficient.chart.getOption();
// 	// reviewEfficient.chartRef.value?.setOption(option);
// };

onMounted(() => {
	github.addData();
	nextTick(() => {
		openRankChart.chart.initChart([]);
		reviewEfficient.chart.initChart([]);
		radarFirst.chart.initChart([]);
		deverChart.chart.initChart([]);
		attentChart.chart.initChart([]);
		projectChart.chart.initChart([]);
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
			margin-top: 12px;

			.chart-container {
				width: 100%;
				height: 100%;
			}

			.virtual-list-content {
				display: flex;
				flex-direction: column;
				height: 98%;
				padding: 0 8px;

				.virtual-list-item {
					display: flex;
					gap: 8px;
					align-items: center;
					padding: 4px 0;
					color: rgb(255 255 255);
					cursor: pointer;

					&:hover {
						color: #68d8ff;
						background: rgb(255 255 255 / 10%);
					}

					&-col {
						width: 16.7%;
						text-align: center;
					}
				}
			}

			&-left {
				flex-direction: column;
				row-gap: 8px !important;
				height: 100%;

				&-item:nth-child(1) {
					flex: 2;
					height: 66.6%;
				}

				&-item:nth-child(2) {
					flex: 1;
					height: 33.3%;
				}
			}

			&-center {
				flex-direction: column;
				row-gap: 8px !important;
				height: 100%;

				&-item:nth-child(1) {
					flex: 2;
					height: 66.6%;

					.index-data {
						display: flex;
						flex-direction: column;
						height: 100%;
						margin: 0 16px;
					}
				}

				&-item:nth-child(2) {
					flex: 1;
					height: 33.3%;
				}
			}

			&-right {
				flex-direction: column;
				row-gap: 8px !important;
				height: 100%;

				&-item {
					flex: 1;
					height: 33.3%;
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
./composables/use-radar
