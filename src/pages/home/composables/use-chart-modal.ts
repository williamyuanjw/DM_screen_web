import { reactive } from 'vue';

type ChartModalType = {
	visible: boolean;
	changeVisible: (visible: boolean, type: number) => void;
	type: number;
};

export default function (): ChartModalType {
	// 方便打开弹窗时执行一些逻辑
	const changeVisible = (visible: boolean, type: number) => {
		chartModal.type = type;
		chartModal.visible = visible;
	};

	const chartModal = reactive<ChartModalType>({
		visible: false,
		changeVisible,
		type: 0
	});

	return chartModal;
}
