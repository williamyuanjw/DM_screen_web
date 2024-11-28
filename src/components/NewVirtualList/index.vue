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
				<div class="fs-estimated-virtuallist-list-item" ref="itemRef" v-for="i in renderList" :key="i.project_id">
					<slot name="item" :item="i"></slot>
				</div>
			</div>

			<div class="fs-estimated-virtuallist-list" :style="scrollStyle">
				<div class="fs-estimated-virtuallist-list-item" v-for="i in virList" :key="i.project_id">
					<slot name="item" :item="i"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { type CSSProperties, computed, onMounted, reactive, ref, watch, PropType, nextTick } from 'vue';
import type { VirtualStateType } from './data';
import { delayRef } from '@/utils/base';
import { GitHubItem } from '@/pages/home/composables/use-github';
import { debounce } from 'lodash';

const props = defineProps({
	loading: {
		type: Boolean,
		required: true
	},
	dataSource: {
		type: Array as PropType<GitHubItem[]>,
		required: true
	}
});

const emit = defineEmits(['scroll-end']);

const propList = ref<GitHubItem[]>([]);

const contentRef = ref<HTMLDivElement>();

const listRef = ref<HTMLDivElement>();

const itemRef = ref<HTMLDivElement[]>();

const state = reactive<VirtualStateType>({
	viewHeight: 0,
	itemHeight: 0,
	startIndex: 0,
	maxCount: 1,
	preLen: 0,
	rafTimer: null,
	isHover: false
});

const endIndex = computed(() => Math.min(propList.value.length, state.startIndex + state.maxCount));

const renderList = computed(() => propList.value.slice(state.startIndex, endIndex.value));

const virList = computed(() => propList.value.slice(0, state.maxCount)); // 复制多几个用来无缝滚动的

const scrollStyle = computed(
	() =>
		({
			transform: `translate3d(0, ${state.itemHeight * state.startIndex}px, 0)`
		} as CSSProperties)
);

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
		contentRef.value.scrollTop += 1;
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
	let { scrollTop } = contentRef.value!;
	state.startIndex = Math.floor(scrollTop / state.itemHeight);
	if (renderList.value.length === 0) {
		contentRef.value!.scrollTop = 0;
		!props.loading && emit('scroll-end');
	}
});

/**
 * @description 初始化
 */
const init = () => {
	state.viewHeight = contentRef.value ? contentRef.value.offsetHeight : 0;
};

/**
 * @description 将新拿到的列表赋值给propList
 */
const addNewList = () => {
	const disLen = props.dataSource.length - state.preLen;
	for (let i = 0; i < disLen; i++) {
		const newIndex = i + state.preLen;
		propList.value.push(props.dataSource[newIndex]);
	}
	state.preLen = propList.value.length;
};

/**
 * @description 重新计算最大数
 */
const handleSetPosition = () => {
	nextTick(() => {
		state.viewHeight = contentRef.value ? contentRef.value.offsetHeight : 0;
		if (itemRef.value) {
			// 拿数组第一项计算最大
			state.maxCount = Math.ceil(state.viewHeight / itemRef.value[0].offsetHeight) + 1;
			state.itemHeight = itemRef.value[0].offsetHeight;
		}
	});
};

/**
 * @description 监听容器宽高变化
 */
const observeContent = () => {
	if (contentRef.value) {
		const observer = new ResizeObserver(debounce(handleSetPosition, 300));
		observer.observe(contentRef.value);
	}
};

onMounted(() => {
	observeContent();
	init();
});

watch(
	() => props.dataSource.length,
	() => {
		// 接受到的列表高度变化
		addNewList();
		handleSetPosition();
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
.fs-estimated-virtuallist {
	&-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	&-content {
		scrollbar-width: none;
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
