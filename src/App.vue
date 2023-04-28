<template>
  <div class="app">
    <ConfigProvider :locale="zhCN">
      <router-view />
    </ConfigProvider>
    <customer-service />
  </div>
</template>
<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
</script>

<style scoped lang="less">
.app {
  height: 100%;
}
</style>
