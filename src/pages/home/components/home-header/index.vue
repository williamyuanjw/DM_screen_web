<template>
	<div class="home-header">
		<div class="home-header-title">开源数据发展趋势仪表盘</div>
		<div class="home-header-time">
			<span class="date-value">{{ date }}</span>
			<span class="time-value">{{ time }}</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import { onBeforeUnmount, onMounted, ref } from 'vue';

let timer: any = null;
const time = ref<string>('--');
const date = ref<string>('--');

const getTime = () => {
	time.value = dayjs().format('dddd HH:mm:ss');
	date.value = dayjs().format('YYYY/MM/DD');
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
.home-header {
	position: relative;
	height: 65px;
	padding-top: 3px;
	text-align: center;
	background: url('@/assets/images/home-header.png') no-repeat;
	background-size: 100% 100%;

	&-title {
		font-size: 26px;
		font-weight: bold;
		color: #ffffff;

		// text-shadow: 0 0 0.5rem #0a54ea;
	}

	&-time {
		font-size: 18px;
		color: rgb(255 255 255 / 70%);

		.time-value {
			position: absolute;
			top: 30px;
			right: 30px;
		}

		.date-value {
			position: absolute;
			top: 30px;
			right: 170px;
		}
	}
}

@media (max-width: 600px) {
	.home-header {
		height: 70px;

		&-time {
			font-size: 24px;

			.date-value {
				position: absolute;
				top: 30px;
				right: unset;
				left: 70px;
			}
		}
	}
}

@media (max-width: 450px) {
	.home-header {
		height: 80px;
		padding-top: 4px;
	}
}
</style>
