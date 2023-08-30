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
								<ModuleItem> </ModuleItem>
							</a-col>
							<a-col class="chart-content-left-item" :span="24">
								<ModuleItem>
									<div :ref="openRankChart.container" class="open-rank-line"></div>
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
								<ModuleItem />
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
			<!-- <header-first /> -->
			<!-- <virtual-list
				style="height: 200px"
				:data-source="dataSource"
				:loading="loading"
				:estimated-height="10"
				@scroll-end="addData"
			>
				<template #item="{ item }">
					<div class="list-item" style="color: #ffffff">{{ item.id }} - {{ item.content }}</div>
				</template>
			</virtual-list> -->
			<section></section>
			<footer></footer>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { debounce } from 'lodash';
import HomeHeader from './components/home-header/index.vue';
import EarthBg from './components/earth-bg/index.vue';
// import VirtualList from '@/components/VirtualList/index.vue';
import useOpenRank from './composables/use-open-rank';
const openRankChart = useOpenRank();

// const loading = ref(false);
// const dataSource = ref<{ id: number; content: string }[]>([]);
// const addData = () => {
// 	loading.value = true;
// 	setTimeout(() => {
// 		const newData = [];
// 		for (let i = 0; i < 20; i++) {
// 			const len: number = dataSource.value.length + newData.length;
// 			newData.push({
// 				id: len,
// 				content: 'test' // 内容
// 			});
// 		}
// 		dataSource.value = [...dataSource.value, ...newData];
// 		loading.value = false;
// 	}, 2000);
// };
/**
 * @description 处理全部图表的缩放
 */
const chartResize = debounce(() => {
	openRankChart.chart.resizeChart();
}, 500);

onMounted(() => {
	nextTick(() => {
		openRankChart.chart.initChart([]);
	});
	window.addEventListener('resize', chartResize);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', chartResize);
});

// onMounted(() => {
// 	addData();
// });
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
			// height: 100%;
			height: calc(100% - 65px);

			// overflow-y: scroll;
			&-left {
				flex-direction: column;
				height: 100%;

				&-item:nth-child(1) {
					flex: 2;
				}

				&-item:nth-child(2) {
					flex: 1;
				}

				.open-rank-line {
					width: 100%;
					height: 100%;
				}
			}

			&-center {
				flex-direction: column;
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
				height: 100%;

				&-item {
					flex: 1;
				}
			}
		}

		@media (max-width: 600px) {
			.chart-content {
				height: calc(100% - 70px);
			}
		}

		@media (max-width: 450px) {
			.chart-content {
				height: calc(100% - 80px);
			}
		}
	}
}
</style>
