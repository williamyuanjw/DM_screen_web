<template>
	<div class="earth-bg-animate">
		<div class="earth1"></div>
		<div class="earth2"></div>
		<div class="earth3"></div>
	</div>
</template>

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

.earth-bg-animate {
	position: absolute;
	top: 50%;
	left: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 450px;
	height: 450px;
	pointer-events: none;
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
</style>
