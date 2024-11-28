<template>
	<div class="fs-estimated-virtuallist-container">
		<div
			class="fs-estimated-virtuallist-content"
			ref="contentRef"
			@mouseleave="leave"
			@mouseenter="enter"
			@mouseover="over"
			@scroll="handleScroll"
		>
			<div class="fs-estimated-virtuallist-list" ref="listRef" :style="scrollStyle">
				<div
					class="fs-estimated-virtuallist-list-item"
					ref="itemRef"
					v-for="i in renderList"
					:key="i.project_id"
					:id="String(i.sort_id)"
				>
					<slot name="item" :item="i"></slot>
				</div>
			</div>

			<div class="fs-estimated-virtuallist-list" :style="scrollStyle2">
				<div
					class="fs-estimated-virtuallist-list-item"
					v-for="i in virList"
					:key="i.project_id"
					:id="String(i.sort_id)"
				>
					<slot name="item" :item="i"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type CSSProperties, computed, nextTick, onMounted, reactive, ref, watch, PropType } from 'vue';
import type { IPosInfo, VirtualStateType } from './data';
import { delayRef } from '@/utils/base';
import { GitHubItem } from '@/pages/home/composables/use-github';

const props = defineProps({
	loading: {
		type: Boolean,
		required: true
	},
	estimatedHeight: {
		type: Number,
		required: true
	},
	dataSource: {
		type: Array as PropType<GitHubItem[]>,
		required: true
	}
});

const emit = defineEmits(['scroll-end']);

const contentRef = ref<HTMLDivElement>();

const listRef = ref<HTMLDivElement>();

const itemRef = ref<HTMLDivElement[]>();

const positions = ref<IPosInfo[]>([]);

const state = reactive<VirtualStateType>({
	viewHeight: 0,
	listHeight: 0,
	startIndex: 0,
	maxCount: 0,
	preLen: 0,
	virList: [],
	rafTimer: null,
	isHover: false
});

const endIndex = computed(() => Math.min(props.dataSource.length, state.startIndex + state.maxCount));

const renderList = computed(() => props.dataSource.slice(state.startIndex, endIndex.value));

const virList = computed(() => props.dataSource.slice(0, state.maxCount)); // 复制多几个用来无缝滚动的

const offsetDis = computed(() => (state.startIndex > 0 ? positions.value[state.startIndex - 1].bottom : 0));

const scrollStyle = computed(
	() =>
		({
			height: `${state.listHeight - offsetDis.value}px`,
			transform: `translate3d(0, ${offsetDis.value}px, 0)`
		} as CSSProperties)
);

const scrollStyle2 = computed(
	() =>
		({
			transform: `translate3d(0, ${offsetDis.value}px, 0)`
		} as CSSProperties)
);

// 初始化：拿到数据源初始化 pos 数组
const initPosition = () => {
	const pos: IPosInfo[] = [];
	const disLen = props.dataSource.length - state.preLen;
	const preTop = positions.value[positions.value.length - 1] ? positions.value[positions.value.length - 1].top : 0;
	const preBottom = positions.value[positions.value.length - 1]
		? positions.value[positions.value.length - 1].bottom
		: 0;
	for (let i = 0; i < disLen; i++) {
		const item = props.dataSource[state.preLen + i];
		pos.push({
			index: item.sort_id,
			height: props.estimatedHeight,
			top: preTop ? preTop + i * props.estimatedHeight : item.sort_id * props.estimatedHeight,
			bottom: preBottom ? preBottom + (i + 1) * props.estimatedHeight : (item.sort_id + 1) * props.estimatedHeight,
			dHeight: 0
		});
	}
	positions.value = [...positions.value, ...pos];
	state.preLen = props.dataSource.length;
};

// 数据 item 渲染完成后，更新数据item的真实高度
const setPosition = () => {
	const nodes = listRef.value?.children;

	if (!nodes || !nodes.length) return;
	[...nodes].forEach(node => {
		const rect = node.getBoundingClientRect();
		const item = positions.value[+node.id];
		const dHeight = item.height - rect.height;
		if (dHeight) {
			item.height = rect.height;
			item.bottom = item.bottom - dHeight;
			item.dHeight = dHeight;
		}
	});

	const startId = +nodes[0].id;
	const len = positions.value.length;
	let startHeight = positions.value[startId].dHeight;
	positions.value[startId].dHeight = 0;
	for (let i = startId + 1; i < len; i++) {
		const item = positions.value[i];
		item.top = positions.value[i - 1].bottom;
		item.bottom = item.bottom - startHeight;
		if (item.dHeight !== 0) {
			startHeight += item.dHeight;
			item.dHeight = 0;
		}
	}

	state.listHeight = positions.value[len - 1].bottom;
};

/**
 * @description 播放滚动
 */
const move = () => {
	if (state.isHover) return;
	// 加载中就停止
	if (props.loading) {
		_cancel();
		return;
	}
	if (contentRef.value) {
		// 实际不会触发 只会触发handleScroll
		if (positions.value.length && contentRef.value.scrollTop >= positions.value[positions.value.length - 1].bottom) {
			contentRef.value.scrollTop = 0;
			!props.loading && emit('scroll-end');
		} else {
			contentRef.value.scrollTop += 1;
		}
	}
	state.rafTimer = delayRef(move);
};

const _cancel = () => {
	state.rafTimer !== null && window.cancelAnimationFrame(state.rafTimer);
};

const enter = () => {
	state.isHover = true; //关闭_move
	_cancel();
};

const leave = () => {
	state.isHover = false; //开启_move
	move();
};

const over = () => {
	_cancel();
};

const init = () => {
	state.viewHeight = contentRef.value ? contentRef.value.offsetHeight : 0;
	state.maxCount = Math.ceil(state.viewHeight / props.estimatedHeight) + 1;
};

// raf节流
function rafThrottle(fn: Function) {
	let lock = false;
	return function (this: any, ...args: any[]) {
		if (lock) return;
		lock = true;
		window.requestAnimationFrame(() => {
			fn.apply(this, args);
			lock = false;
		});
	};
}

const handleScroll = rafThrottle(() => {
	const { scrollTop } = contentRef.value!;
	state.startIndex = binarySearch(positions.value, scrollTop);

	if (
		contentRef.value &&
		positions.value.length &&
		contentRef.value.scrollTop >= positions.value[positions.value.length - 1].bottom
	) {
		contentRef.value.scrollTop = 0;
		!props.loading && emit('scroll-end');
	}
});

const binarySearch = (list: IPosInfo[], value: number) => {
	let left = 0,
		right = list.length - 1,
		templateIndex = -1;
	while (left < right) {
		const midIndex = Math.floor((left + right) / 2);
		const midValue = list[midIndex].bottom;
		if (midValue === value) return midIndex;
		else if (midValue < value) left = midIndex + 1;
		else if (midValue > value) {
			if (templateIndex === -1 || templateIndex > midIndex) templateIndex = midIndex;
			right = midIndex;
		}
	}
	return templateIndex;
};

const handleSetPosition = () => {
	props.dataSource.length && initPosition();
	nextTick(() => {
		if (itemRef.value) {
			state.viewHeight = contentRef.value ? contentRef.value.offsetHeight : 0;
			// 拿数组第一项计算最大
			state.maxCount = Math.ceil(state.viewHeight / itemRef.value[0].offsetHeight) + 1;
		}
		props.dataSource.length && setPosition();
	});
};

onMounted(() => {
	if (contentRef.value) {
		const observer = new ResizeObserver(handleSetPosition);
		observer.observe(contentRef.value);
	}
	init();
});

watch([() => listRef.value, () => props.dataSource.length], handleSetPosition);

watch(
	() => state.startIndex,
	() => {
		setPosition();
	}
);

watch(
	() => props.loading,
	value => {
		// 加载完之后开始动画
		if (!value) {
			move();
		}
	}
);
</script>

<style scoped lang="scss">
// 隐藏滚动条
// ::-webkit-scrollbar {
// 	display: none;
// 	background-color: transparent;
// }
.fs-estimated-virtuallist {
	&-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	&-content {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	&-list-item {
		box-sizing: border-box;
		width: 100%;
	}
}
</style>
