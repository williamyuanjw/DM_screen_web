import { EChartsType } from 'echarts/core';

/**
 * @description 延迟触发raf
 * @param callback 回调
 * @param duration 延迟时间
 * @returns raf的id
 */
export function timer(callback: () => void, duration: number) {
	let startTime: number | null = null;
	let timer;

	function frame(timestamp: number) {
		if (!startTime) {
			startTime = timestamp;
		}

		const elapsed = timestamp - startTime;
		if (elapsed >= duration) {
			callback();
		} else {
			timer = requestAnimationFrame(frame);
		}
	}

	timer = requestAnimationFrame(frame);
	return timer;
}

/**
 * @description 延迟一帧触发
 * @param callback 回调
 * @returns raf的id
 */
export function delayRef(callback: () => void) {
	let timer;
	function frame() {
		timer = requestAnimationFrame(callback);
	}
	timer = requestAnimationFrame(frame);
	return timer;
}

/**
 *
 * @returns 根据rem计算出的px
 */
export const getHtmlFontPX = (remValue: number) => {
	const fontSize = window.getComputedStyle(document.documentElement, null).fontSize.replace('px', '');
	return Number(fontSize) * remValue + 'px';
};

/**
 * @description 处理图表resize
 * @returns HTML元素上的fontSize设置
 */
export const handleChartResize = (chartRef: EChartsType) => {
	chartRef &&
		chartRef.resize({
			animation: {
				duration: 300,
				easing: 'cubicInOut'
			}
		});
};
