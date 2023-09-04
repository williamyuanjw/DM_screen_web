<template>
	<div class="radar-list">
		<a-row class="radar-list-row" :gutter="[16, 16]">
			<a-col class="radar-list-col" v-bind="colSetting">
				<div :ref="radarFirst.container" class="radar-ref"></div>
			</a-col>
		</a-row>
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ColProps } from 'ant-design-vue';

import { RadarChartType } from '../../data';

const colSetting: ColProps = {
	span: 24
};

defineProps({
	radarFirst: {
		type: Object as PropType<RadarChartType>,
		required: true
	}
});
</script>

<style lang="scss" scoped>
.radar-list {
	display: flex;
	flex: 1;
	flex-direction: column;
	margin-top: 16px;

	&-row {
		flex: 1;
	}

	&-col {
		height: 100%;

		.radar-ref {
			height: 100%;
		}
	}

	@media (max-width: 992px) {
		&-row {
			flex-direction: column;
		}

		&-col {
			flex: 1;
			height: auto;
		}
	}
}
</style>
