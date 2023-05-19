import * as echarts from 'echarts/core';
import { ToolboxComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
	ToolboxComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	BarChart,
	LineChart,
	CanvasRenderer,
	UniversalTransition
]);

export default echarts;
