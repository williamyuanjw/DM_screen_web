import { createApp } from 'vue';
import './style.css';
import 'ant-design-vue/es/message/style/css';
import App from './App.vue';
import router from '@/router/index';
import pinia from './store/index';

const app = createApp(App);
app.use(pinia).use(router).mount('#app');
