import { ref } from 'vue';
import echarts from '@/echarts';
import { handleChartResize } from '@/utils/base';

export default function useWorldMap() {
	let chartRef = ref<HTMLDivElement | undefined | any>();

	const getOption = () => {
		return {
			series: {
				type: 'map',
				map: 'world',
				roam: true,
				data: [
					{
						name: 'China',
						value: 150
					},
					{
						name: 'United States',
						value: 200
					},
					{
						name: 'Russia',
						value: 100
					},
					{
						name: 'Australia',
						value: 70
					}
				]
			},
			tooltip: {
				show: true
			},
			visualMap: {
				color: ['#f80202', '#ca7701', '#05da0c', '#8bd2fd']
			}
		};
	};

	const initData = ({ data }: any) => {

		let option = getOption();
		chartRef.value = echarts.init(chartRef.value!);
		echarts.registerMap('world', data);
		chartRef.value && chartRef.value.setOption(option);
	};
	const resizeChart = () => {
		if (chartRef.value) {
			handleChartResize(chartRef.value);
		}
	};

	return {
		chartRef,
		getOption,
		initData,
		resizeChart
	};
}
