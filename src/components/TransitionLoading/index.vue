<template>
	<transition name="loading">
		<div id="load" v-if="isShow">
			<div class="load_img">
				<img class="jzxz1" src="@/assets/images/jzxz1.png" />
				<img class="jzxz2" src="@/assets/images/jzxz2.png" />
			</div>
		</div>
	</transition>
</template>

<script setup lang="ts">
defineProps({
	isShow: {
		type: Boolean,
		default: false
	}
});
</script>

<style lang="scss" scoped>
@keyframes xz1 {
	from {
		transform: rotate(0deg);
	}

	50% {
		transform: rotate(180deg);
	}

	to {
		transform: rotate(360deg);
	}
}

@keyframes xz2 {
	from {
		transform: rotate(0deg);
	}

	50% {
		transform: rotate(-180deg);
	}

	to {
		transform: rotate(-360deg);
	}
}

.loading-enter,
.loading-leave-to {
	opacity: 0;
}

.loading-enter-to,
.loading-leave {
	opacity: 1;
}

.loading-enter-active,
.loading-leave-active {
	transition: all 2s;
}

#load {
	position: absolute;
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: url('@/assets/images/load-bg.png') no-repeat;
	background-size: cover;

	.load_img {
		.jzxz1 {
			position: absolute;
			width: 365px;
			animation: xz1 8s infinite linear;
		}

		.jzxz2 {
			width: 365px;
			animation: xz2 7s infinite linear;
		}
	}
}

// 小屏幕下的样式
@media (max-width: 576px) {
	#load {
		align-items: baseline;
		padding-top: 20vh;
	}
}
</style>
