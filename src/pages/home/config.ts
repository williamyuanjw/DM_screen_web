import ThemeColor from '@/themeColor';
import { TitltListItem } from './data';

// 三栏布局响应式
export const leftRightCol = {
	sm: {
		span: 7
	},
	xs: {
		span: 24,
		order: 2
	}
};

export const centerCol = {
	sm: {
		span: 10,
		order: 2
	},
	xs: {
		span: 24,
		order: 1
	}
};

export const colorList = [
	ThemeColor.lineBlue,
	ThemeColor.lineGreen,
	ThemeColor.lineYellow,
	ThemeColor.linePink,
	ThemeColor.lineRed,
	ThemeColor.lineOrange
];

export const titleList: TitltListItem[] = [
	{
		label: '项目名',
		width: '20%'
	},
	{
		label: '影响力',
		width: '16%'
	},
	{
		label: '发展趋势',
		width: '16%'
	},
	{
		label: '社区反应',
		width: '16%'
	},
	{
		label: '开发活跃度',
		width: '16%'
	},
	{
		label: 'Github指数',
		width: '16%'
	}
];

export const dateList = [
	'2020-01',
	'2020-02',
	'2020-03',
	'2020-04',
	'2020-05',
	'2020-06',
	'2020-07',
	'2020-08',
	'2020-09',
	'2020-10',
	'2020-11',
	'2020-12',
	'2021-01',
	'2021-02',
	'2021-03',
	'2021-04',
	'2021-05',
	'2021-06',
	'2021-07',
	'2021-08',
	'2021-09',
	'2021-10',
	'2021-11',
	'2021-12',
	'2022-01',
	'2022-02',
	'2022-03',
	'2022-04',
	'2022-05',
	'2022-06',
	'2022-07',
	'2022-08',
	'2022-09',
	'2022-10',
	'2022-11',
	'2022-12',
	'2023-01',
	'2023-02',
	'2023-03'
];
