<template>
	<div class="home">
		<div class="chart-list">
			<home-header />
			<div style="padding: 0 8px" class="chart-content">
				<a-row :gutter="[16, 16]" style="height: 100%">
					<a-col :xl="{ order: 1, span: 7 }" :span="24" :order="2">
						<a-row class="chart-content-left" :gutter="[16, 16]">
							<a-col :xl="24" :span="12">
								<ModuleItem />
							</a-col>
							<a-col :xl="24" :span="12">
								<ModuleItem />
							</a-col>
						</a-row>

						<!-- <ModuleItem /> -->
					</a-col>
					<a-col
						class="chart-content-center"
						:span="24"
						:xl="{ order: 2, span: 10 }"
						:xs="{ order: 1 }"
						:sm="{ order: 1 }"
					></a-col>
					<a-col :xl="{ order: 3, span: 7 }" :span="24" :order="3">
						<a-row class="chart-content-right" :gutter="[16, 16]">
							<a-col :xl="24" :span="8">
								<ModuleItem />
							</a-col>
							<a-col :xl="24" :span="8">
								<ModuleItem />
							</a-col>
							<a-col :xl="24" :span="8">
								<ModuleItem />
							</a-col>
						</a-row>
					</a-col>
				</a-row>
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

		<div class="earth-bg">
			<div class="earth1"></div>
			<div class="earth2"></div>
			<div class="earth3"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import HomeHeader from './components/home-header/index.vue';
// import HeaderFirst from './components/header-first/index.vue';
// import VirtualList from '@/components/VirtualList/index.vue';
import { onMounted, ref } from 'vue';

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

onMounted(() => {
	addData();
});
</script>

<style lang="scss" scoped>
@keyframes rotate1 {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}

@keyframes rotate2 {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(-360deg);
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
			height: calc(100% - 65px);
			padding: 0 16px;

			@mixin flex-left-right() {
				height: 100%;

				// display: flex;
				// flex: 1.5;
				// flex-direction: column;
				// gap: 8px;
			}

			&-left {
				@include flex-left-right;
			}

			&-center {
				border-radius: 27px;
				border-image-source: url('@/assets/images/center.png');
				border-image-slice: 27 27 27 27;
				border-image-width: 27px 27px 27px 27px;
			}

			&-right {
				@include flex-left-right;
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

	.earth-bg {
		position: absolute;
		top: 50%;
		left: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 450px;
		height: 450px;
		transform: translate(-50%, -50%);

		/* 中间区域动画自定义名称 */
		.earth1 {
			position: absolute;
			width: 80%;
			height: 80%;
			background: url('@/assets/images/map.png');
			background-size: 100% 100%;
			opacity: 0.3;
		}

		.earth2 {
			position: absolute;
			width: 100%;
			height: 100%;
			background: url('@/assets/images/lbx.png');
			background-size: 100% 100%;
			opacity: 0.6;
			animation: rotate1 15s linear infinite;
		}

		.earth3 {
			position: absolute;
			width: 87%;
			height: 87%;
			background: url('@/assets/images/jt.png');
			background-size: 100% 100%;
			opacity: 0.6;
			animation: rotate2 10s linear infinite;
		}
	}
}
</style>
