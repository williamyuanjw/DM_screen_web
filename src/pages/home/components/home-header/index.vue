<template>
	<div class="home-header">
		<div class="home-header-title">开源数据发展趋势仪表盘</div>
		<div class="home-header-time">当前时间: {{ time }}</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { onBeforeUnmount, onMounted, ref } from 'vue';

let timer: any = null;
const time = ref<string>('--');

const getTime = () => {
	time.value = dayjs().format('YYYY/MM/DD dddd HH:mm:ss');
};

onMounted(() => {
	getTime();
	timer = setInterval(() => {
		getTime();
	}, 1000);
});

onBeforeUnmount(() => {
	clearInterval(timer);
});
</script>

<style lang="scss" scoped>
@media (max-width: 1200px) {
	.home-header {
		height: 120px !important;
	}
}
.home-header {
	height: 105px;
	padding-top: 5px;
	text-align: center;
	background: url('@/assets/images/home-header.png') no-repeat;
	background-size: 100% 100%;
	&-title {
		font-size: 28px;
		font-weight: bold;
		color: #ffffff;
	}
	&-time {
		font-size: 15px;
		color: rgb(255 255 255 / 70%);
	}
}
</style>
