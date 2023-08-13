<template>
	<div class="home">
		<div class="chart-list">
			<home-header />
			<header-first />
			<virtual-list />
			<section></section>
			<footer></footer>
		</div>
	</div>
</template>

<script setup lang="ts">
import HomeHeader from './components/home-header/index.vue';
import HeaderFirst from './components/header-first/index.vue';
import VirtualList from '@/components/VirtualList/index.vue';
</script>

<style lang="scss">
.home {
	width: 100%;
	height: 100%;
	background: url('@/assets/images/index-bg.png') no-repeat;
	background-size: 100% 100%;
}
</style>
