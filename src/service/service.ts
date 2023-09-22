import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import router from '@/router';
import { message } from 'ant-design-vue';

const env = import.meta.env.DEV;
const defaultContentType = 'application/x-www-form-urlencoded; charset=UTF-8';
const service = axios.create({
	baseURL: '/', // api的base_url
	timeout: 50000, // 请求超时时间
	withCredentials: true, // 跨域携带cookie
	validateStatus: (status: number) => {
		return status >= 200 && status <= 500;
	}
});

const getToken = function (): string {
	return window.localStorage.getItem('token') || '';
};

/**
 * @description 处理开发环境打包环境接口url
 * @returns url
 */
const formatUrl = (config: InternalAxiosRequestConfig<any>): string | undefined => {
	if (!config.url) return;
	// 如果是开发环境
	if (env) {
		const envPath = '/api';
		return `${envPath}${config.url}`;
	} else {
		return `${config.url}`;
	}
};

/**
 * request拦截器 axios
 * config是axios.post或者get第三个参数的config配置。
 * post和get第一，二个参数实际上是第三个的子集。
 * config可以包含所有axios可用参数，和本系统扩展参数例如：baseUrl
 */
service.interceptors.request.use(
	config => {
		config.url = formatUrl(config);
		// 默认post都是 application/x-www-form-urlencoded; charset=UTF-8，需要转换成string
		if (config.headers['content-type'] === defaultContentType) {
			config.data = qs.stringify(config.data);
		}
		// 有token则加token
		if (getToken()) {
			config.headers.Authorization = 'Bearer ' + getToken();
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

/**
 * respone拦截器 axios
 * 处理403，主要是后端的登录重定向，后端其实不一定是登录的重定向
 * 302重定向。同上，后端其实不一定是登录的重定向。
 */
service.interceptors.response.use(
	response => {
		const { data } = response;
		const dataMessage = data.msg || data.error_description || '未知错误';
		const headersType = response.headers['Content-Type'];
		const contentType: unknown[] = ['application/vnd.ms-excel;charset=utf-8', 'application/octet-stream'];
		// 文件流数据直接返回
		if (headersType && contentType.includes(headersType)) {
			return response;
		}

		if (data.code === 401) {
			router.replace({ path: '/login' });
			return Promise.reject(data);
		}

		if (data.hasOwnProperty('error_code')) {
			message.error(dataMessage);
			return Promise.reject(data);
		}

		if (data.code !== 200) {
			return Promise.reject(data);
		}
		return data;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

export default service;
