<template>
	<div class="home">
		<transition-loading :isShow="loadShow" />
		<div class="chart-list">
			<home-header />
			<div style="padding: 0 8px" class="chart-content">
				<!-- 整体布局 左 中 右 -->
				<a-row :gutter="[8, 8]" class="chart-content-row">
					<!-- 左侧 -->
					<a-col v-bind="leftRightCol" class="chart-content-col">
						<a-row class="chart-content-left">
							<a-col class="chart-content-left-item" :span="24">
								<ModuleItem title="过去12个月的Commit提交数" :loading="initLoading">
									<div :ref="reviewEfficient.container" class="chart-container" />
								</ModuleItem>
							</a-col>
							<a-col class="chart-content-left-item" :span="24">
								<ModuleItem title="" :loading="initLoading">
									<!--									<div :ref="openRankChart.container" class="chart-container"></div>-->
									<div style="text-indent: 2rem" class="openText">
										本项目使用Vue3框架结合Ant Design of Vue
										组件库开发，开发语言使用TypeScript，结合第三方库Echarts完成可视化系统开发。
										项目的数据都是真实数据，从GitHub官网download下来的数据和从一些网站获取到的数据。
										<div>
											<br />
											Github:
											<a target="_blank" href="https://github.com/remember123456789/DM_screen_web">
												https://github.com/remember123456789/DM_screen_web
											</a>
											<!--												1.使用vue Hooks封装Echarts组件,提升代码的复用性-->
											<!--												<br/>-->
											<!--												2.不定高无限滚加载虚拟列表-->
											<!--												<br/>-->
											<!--												3.实现对不同大小的屏幕/设备的良好适配-->
										</div>
									</div>
								</ModuleItem>
							</a-col>
						</a-row>
					</a-col>
					<!-- 中间 -->
					<a-col v-bind="centerCol" class="chart-content-col">
						<a-row class="chart-content-center">
							<a-col class="chart-content-center-item" :span="24">
								<ModuleItem :loading="initLoading">
									<div class="index-data">
										<index-num :initData="initData" />
										<!--										雷达图-->
										<radar-list :radarFirst="radarFirst" />
									</div>
								</ModuleItem>
							</a-col>
							<a-col class="chart-content-center-item" :span="24">
								<ModuleItem title="项目活跃度Top24" :loading="github.loading">
									<div class="virtual-list-content">
										<list-header :titleList="titleList" />
										<new-virtual-list :data-source="github.dataSource" :loading="github.loading" class="virtual-list">
											<!--                     <!-具名插槽&ndash;&gt;-->
											<template #item="{ item }">
												<!--												文字提示-->
												<a-tooltip placement="top" color="rgba(73, 146, 255, 0.8)">
													<template #title>
														<span>项目名：{{ item.title }}</span>
													</template>
													<!--													底部滚动区域-->
													<div class="virtual-list-item" @click="radarFirst.chart.addRadarData(item)">
														<span class="virtual-list-item-col">{{ item.title }}</span>
														<span class="virtual-list-item-col">{{ item.rank }}</span>
														<span class="virtual-list-item-col">{{ item.star }}</span>
														<span class="virtual-list-item-col">{{ item.fork }}</span>
														<span class="virtual-list-item-col">{{ item.language }}</span>
														<span class="virtual-list-item-col">{{ item.github }}</span>
													</div>
												</a-tooltip>
											</template>
										</new-virtual-list>
									</div>
								</ModuleItem>
							</a-col>
						</a-row>
					</a-col>
					<!-- 右侧 -->
					<a-col v-bind="leftRightCol" class="chart-content-col">
						<a-row class="chart-content-right">
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem title="vuejs/core" :loading="initLoading">
									<div :ref="attentChart.container" class="chart-container"></div>
								</ModuleItem>
							</a-col>
							<a-col class="chart-content-right-item" :span="24">
								<ModuleItem title="项目活跃度" :loading="initLoading">
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
	<!-- 弹窗 -->
	<chart-modal
		v-model:visible="chartModalData.visible"
		:type="chartModalData.type"
		:defaultValue="chartModalData.selectValue"
	/>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { debounce } from 'lodash';

import indexImg from '@/assets/images/index-bg.png';
import centerImg from '@/assets/images/center.png';
import headerImg from '@/assets/images/home-header.png';
import mapImg from '@/assets/images/map.png';
import lbxImg from '@/assets/images/lbx.png';
import jtImg from '@/assets/images/jt.png';

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

import { titleList, leftRightCol, centerCol } from './config';
import { getCodeCommit, getCommits, getProjectList } from './service';
import { message } from 'ant-design-vue';

const chartModalData = useChartModal();
const openRankChart = useOpenRank({ showHandler: chartModalData.changeVisible, type: 2 });
const deverChart = useOpenRank({ showHandler: chartModalData.changeVisible, type: 3 });
const attentChart = useOpenRank({ showHandler: chartModalData.changeVisible, type: 4 });
const projectChart = useOpenRank({ showHandler: chartModalData.changeVisible, type: 5 });
const reviewEfficient = useReviewEfficient(chartModalData.changeVisible);
const github = useGithub();
const radarFirst = useRadar();

const time = 3600000;
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
});

const loadShow = ref<boolean>(true);
// 异步图片加载方式
const loadImg = () => {
	const imgArr = [indexImg, centerImg, headerImg, mapImg, lbxImg, jtImg];
	let promiseList = imgArr.map(item => {
		return new Promise(resolve => {
			const newImg = new Image();
			newImg.src = item;
			newImg.onload = () => {
				resolve(true);
			};
		});
	});

	Promise.all(promiseList).then(() => {
		loadShow.value = false;
	});
};

const initData = reactive({
	openRank: 90,
	gitHub: 20
});

const initLoading = ref<boolean>(false);
const getInitData = async () => {
	initLoading.value = true;
	try {
		const res = await getCommits();
		const result = await getProjectList();
		const result1 = await getCodeCommit();
		// 数据初始化
		nextTick(() => {
			github.dataSource = result.data.trendingList;
			reviewEfficient.chart.initChart(res);
			radarFirst.chart.initChart();
			attentChart.chart.initChart(result1);
			projectChart.chart.initChart();
		});
		setInterval(() => {
			initData['gitHub'] += 1;
			initData['openRank'] -= 2;
		}, 5000);
	} catch (error) {
		if (error instanceof Error) {
			message.error(error.message);
		} else {
			console.log(error);
		}
	} finally {
		github.loading = false;
		initLoading.value = false;
	}
};

onMounted(() => {
	loadImg();
	getInitData();
	github.addData();
	window.addEventListener('resize', chartResize);
	setInterval(() => {
		getInitData();
	}, time);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', chartResize);
});
</script>

<style lang="scss" scoped>
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

			.chart-content-row,
			.chart-content-col {
				height: 100%;
			}

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
					padding: 4px;
					color: rgb(255 255 255);
					cursor: pointer;

					&:hover {
						color: #68d8ff;
						background: rgb(255 255 255 / 10%);
					}

					&-col {
						width: 16%;
						overflow: hidden;
						text-align: center;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					&-col:nth-child(1) {
						width: 19.5%;
						text-align: left;
					}
				}
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

				&-item:nth-child(1) {
					flex: 2;

					.index-data {
						display: flex;
						flex-direction: column;
						height: 100%;
						margin: 0 16px;
					}
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
	}
}

// 小屏幕下的样式
@media (max-width: 576px) {
	.home {
		height: unset;
		background: #060c20;

		.chart-content {
			.chart-content-col:first-child {
				height: 1000px !important;
			}

			&-left,
			&-center {
				&-item {
					flex: 1 !important;
				}
			}

			.chart-content-col:nth-child(2) {
				height: 1500px !important;
			}

			.chart-content-col:nth-child(3) {
				height: 1500px !important;
			}
		}
	}
}

.openText {
	width: 97%;
	margin: auto;
	color: white;
}
</style>

<style lang="scss">
.ant-tooltip-inner {
	min-height: unset;
}

.tooltip-review {
	// width: 80%;
	overflow: hidden;

	.tooltip-title {
		width: 180px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tooltip-btn {
		width: max-content;
		padding: 2px 5px;
		margin: 5px 5px 0 0;
		color: #ffffff;
		cursor: pointer;
		background-color: #ff6e76;
		border-radius: 4px;
	}

	.tooltip-item {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.tooltip-label-icon {
		display: flex;
		align-items: center;
		margin-right: 5px;
		overflow: hidden;

		.tooltip-label {
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.tooltip-icon {
			width: 6px;
			height: 6px;
			margin-right: 5px;
			border-radius: 50%;
		}
	}

	.tooltip-value {
		flex: 1;
		flex-shrink: 0;
		font-size: 15px;
		font-weight: bold;
		color: #666666;
	}
}
</style>
