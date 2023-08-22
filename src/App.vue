<template>
	<ConfigProvider :locale="zhCN">
		<router-view />
	</ConfigProvider>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
</script>

<style scoped lang="scss"></style>
