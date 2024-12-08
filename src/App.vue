<template>
		<router-view />
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
</script>

<style scoped lang="scss"></style>
