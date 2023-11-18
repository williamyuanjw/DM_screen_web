// 不定高虚拟列表
export interface IEstimatedListProps<T> {
	loading: boolean;
	estimatedHeight: number;
	dataSource: T[];
}

export interface IPosInfo {
	// 当前pos对应的元素索引
	index: number;
	// 元素顶部所处位置
	top: number;
	// 元素底部所处位置
	bottom: number;
	// 元素高度
	height: number;
	// 高度差：判断是否需要更新
	dHeight: number;
}

export interface VirtualStateType {
	itemHeight: number;
	rafTimer: null | number;
	viewHeight: number;
	startIndex: number;
	maxCount: number;
	preLen: number;
	isHover: boolean;
}
