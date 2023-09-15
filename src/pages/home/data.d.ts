import { Ref } from 'vue';
import { PieSeriesOption, LineSeriesOption, BarSeriesOption } from 'echarts';
import { EChartsType, EChartsCoreOption } from 'echarts/core';
import { GitHubItem } from './composables/use-github';
export type MuSelectValueType = (string | number)[];

// 定义折柱混合图的配置类型
export type MixLineBarType =
	| LineSeriesOption
	| (BarSeriesOption & { symbol?: string; smooth?: boolean; symbolSize?: number });

export type LineChartType = {
	chart: {
		selectValue: MuSelectValueType;
		initChart(nodes: PieSeriesOption['data'], type?: string): void;
		resizeChart(): void;
		extraOption: EChartsCoreOption; // 额外的配置（例如打开详情弹窗的新配置）
	};
	container: Ref<HTMLDivElement | undefined>;
	chartRef: Ref<EChartsType | undefined>;
	getOption(): EChartsCoreOption;
};

export type chartDataObjType = Record<
	string,
	{ data: LineChartType; title: string; container: Ref<HTMLDivElement | undefined>; key?: string; chartType?: string }
>;

export type RadarChartType = {
	chart: {
		selectValue: GitHubItem[];
		initChart(nodes: PieSeriesOption['data']): void;
		resizeChart(): void;
		addRadarData(name: string): void;
	};
	container: Ref<HTMLDivElement | undefined>;
	chartRef: Ref<EChartsType | undefined>;
	getOption(): EChartsCoreOption;
};

export type TitltListItem = {
	label: string;
	width: string | number;
};

export type DateItem = [string, number][];

export type intervalMapType = Record<
	'openrank' | 'project_attention' | 'developer_activity' | 'project_activity',
	Record<string, any>
>;
