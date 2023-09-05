<template>
	<a-select v-bind="attrs"></a-select>
</template>

<script lang="ts">
import { SelectProps } from 'ant-design-vue';
import { defineComponent } from 'vue';

export default defineComponent({
	setup(_: SelectProps, ctx) {
		return {
			attrs: ctx.attrs
		};
	}
});
</script>

<style lang="scss" scoped>
.chart-modal-select {
	::v-deep .ant-select-selector {
		background-color: #3a59a4;
		border-color: #8190b8;

		.ant-select-selection-item {
			color: rgb(255 255 255 / 80%);
			background-color: #4992ff;
			border-color: rgb(255 255 255 / 80%);
		}

		.ant-select-selection-item-remove {
			color: rgb(255 255 255 / 80%);
		}
	}

	&:hover {
		::v-deep .ant-select-selector {
			border-color: #4992ff;
		}
	}
}
</style>

<style lang="scss">
.chart-select-drop {
	color: rgb(255 255 255 / 60%);
	background-color: #3a59a4;

	.ant-select-item {
		color: rgb(255 255 255 / 60%);
	}

	.ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
		background-color: #4992ff;
	}

	.ant-select-item-option-active:not(.ant-select-item-option-disabled) {
		background-color: #6585d2;
	}

	.ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-state {
		color: rgb(255 255 255 / 60%);
	}
}
</style>
