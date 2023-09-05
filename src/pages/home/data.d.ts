import { Ref } from 'vue';
import { PieSeriesOption, LineSeriesOption, BarSeriesOption } from 'echarts';
import { EChartsType, EChartsCoreOption } from 'echarts/core';
export type MuSelectValueType = (string | number)[];

// 定义折柱混合图的配置类型
export type MixLineBarType =
	| LineSeriesOption
	| (BarSeriesOption & { symbol?: string; smooth?: boolean; symbolSize?: number });

export type LineChartType = {
	chart: {
		selectValue: MuSelectValueType;
		initChart(nodes: PieSeriesOption['data']): void;
		resizeChart(): void;
		lastSeries: MixLineBarType[]; // 存储上一次添加或删除的数据 用于恢复折线柱状混合图
		extraOption: EChartsCoreOption; // 额外的配置（例如打开详情弹窗的新配置）
	};
	container: Ref<HTMLDivElement | undefined>;
	chartRef: Ref<EChartsType | undefined>;
	getOption(): EChartsCoreOption;
};

export type chartDataObjType = Record<
	string,
	{ data: LineChartType; title: string; container: Ref<HTMLDivElement | undefined> }
>;

export type RadarChartType = {
	chart: {
		selectValue: MuSelectValueType;
		initChart(nodes: PieSeriesOption['data']): void;
		resizeChart(): void;
	};
	container: Ref<HTMLDivElement | undefined>;
	chartRef: Ref<EChartsType | undefined>;
	getOption(): EChartsCoreOption;
};
