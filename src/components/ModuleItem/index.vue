<template>
	<div class="module-item">
		<a-spin wrapperClassName="spinning" :spinning="loading">
			<div>11</div>
			<template #indicator>
				<div class="circle-3"></div>
			</template>
		</a-spin>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref<boolean>(true);
</script>

<style lang="scss" scoped>
.module-item {
	flex: 1;
	width: 100%;
	border-image-source: url('@/assets/images/newForm.png');
	border-image-slice: 50 50 50 50 fill;
	border-image-width: 50px 50px 50px 50px;

	.spinning {
		height: 100%;

		::v-deep .ant-spin-blur {
			height: 100%;
			padding: 5px;

			&::after {
				border-radius: 20px;
			}
		}
	}
}

.circle-3 {
	position: relative;
	width: 60px;
	height: 60px;
	margin-top: -30px !important;
	margin-left: -30px !important;
	border: 3px solid;
	border-color: #ffffff #ffffff transparent transparent;
	border-radius: 50%;
	animation: rotation 1s linear infinite;
}

.circle-3::after,
.circle-3::before {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	content: '';
	border: 3px solid;
	border-radius: 50%;
	animation: rotation-back 0.5s linear infinite;
}

.circle-3::after {
	width: 52px;
	height: 52px;
	border-color: transparent #f5b251 #f5b251 transparent;
}

.circle-3::before {
	width: 44px;
	height: 44px;
	border-color: transparent transparent #ffffff #ffffff;
}

@keyframes rotation {

	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}

@keyframes rotation-back {

	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(-360deg);
	}
}
</style>
