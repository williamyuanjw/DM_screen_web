import { reactive } from 'vue';
import { MuSelectValueType } from '../data';

type ChartModalType = {
	visible: boolean;
	changeVisible: (visible: boolean, type: number, selectValue: MuSelectValueType) => void;
	type: number;
	selectValue: MuSelectValueType;
};

export default function (): ChartModalType {
	// 方便打开弹窗时执行一些逻辑
	const changeVisible = (visible: boolean, type: number, selectValue: MuSelectValueType) => {
		chartModal.type = type;
		chartModal.selectValue = selectValue;
		chartModal.visible = visible;
	};

	const chartModal = reactive<ChartModalType>({
		visible: false,
		changeVisible,
		selectValue: [4, 8, 9],
		type: 0
	});

	return chartModal;
}
