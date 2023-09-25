<template>
	<div class="module-item">
		<h2 v-if="title">{{ title }}</h2>
		<a-spin wrapperClassName="spinning" :spinning="loading">
			<slot />
			<template #indicator>
				<div class="circle-3"></div>
			</template>
		</a-spin>
	</div>
</template>

<script setup lang="ts">
defineProps({
	title: {
		type: String,
		default: ''
	},
	loading: {
		type: Boolean,
		default: false
	}
});
</script>

<style lang="scss" scoped>
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

.module-item {
	position: relative;
	z-index: 3;
	height: 100%;
	padding-top: 20px;
	background-color: var(--module-bg);
	border-radius: 2vw;
	border-image-source: url('@/assets/images/center.png');
	border-image-slice: 50 50 50 50 fill;
	border-image-width: 50px 50px 50px 50px;

	h2 {
		position: absolute;
		top: 0;
		left: 50%;
		padding: 0.1vw 2vw;
		font-size: 18px;
		font-weight: bold;
		color: #ffffff;
		text-align: center;
		white-space: nowrap;
		background-color: #0a54ea;
		border-radius: 10px;
		transform: translate(-50%, -35%);
	}

	.spinning {
		height: 100%;

		::v-deep .ant-spin-blur {
			height: 100%;

			&::after {
				border-radius: 20px;
			}
		}

		::v-deep .ant-spin {
			max-height: unset;
		}

		::v-deep .ant-spin-container {
			height: 100%;
			overflow: hidden;
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
</style>
