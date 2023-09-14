<template>
	<div class="index-num">
		<a-row class="index-row-value">
			<a-col class="index-col">{{ initData.openRank }}</a-col>
			<a-divider type="vertical" class="index-divider" />
			<a-col class="index-col">{{ initData.gitHub }}</a-col>
		</a-row>
		<a-row class="index-row-label">
			<a-col class="index-col">OpenRank平均值</a-col>
			<a-col class="index-col">GitHub平均值</a-col>
		</a-row>
	</div>
</template>

<script lang="ts" setup>
import { PropType, onMounted } from 'vue';

defineProps({
	initData: {
		type: Object as PropType<{ openRank: string | number; gitHub: string | number }>,
		default: () => ({ openRank: 0, gitHub: 0 })
	}
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
@font-face {
	font-family: electronicFont;
	src: url('@/assets/font/DS-DIGIT.TTF');
}

.index-num {
	background-color: #0f2159;
	border-radius: 4px;

	.index-row-value {
		position: relative;
		padding: 8px 0;
		border: 1px solid rgb(255 255 255 / 20%);

		.index-col {
			flex: 1;
			font-family: electronicFont;
			font-size: 52px;
			color: #ffeb7b;
			text-align: center;

			&:first-child::after {
				position: absolute;
				top: 25%;
				right: 0;
				width: 1px;
				height: 50%;
				content: '';
				background: rgb(255 255 255 / 20%);
			}
		}

		.index-divider {
			height: 100%;
			background-color: rgb(255 255 255 / 70%);
		}

		@mixin border-conrner {
			position: absolute;
			width: 30px;
			height: 15px;
			content: '';
		}

		&::before {
			@include border-conrner;

			top: 0;
			left: 0;
			border-top: 2px solid #02a6b5;
			border-left: 2px solid #02a6b5;
		}

		&::after {
			@include border-conrner;

			right: 0;
			bottom: 0;
			border-right: 2px solid #02a6b5;
			border-bottom: 2px solid #02a6b5;
		}
	}

	.index-row-label {
		color: rgb(255 255 255 / 70%);

		.index-col {
			flex: 1;
			margin: 8px 0;
			font-size: 16px;
			text-align: center;
		}
	}
}
</style>
