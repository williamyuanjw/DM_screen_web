import { message } from 'ant-design-vue';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import http from './service';
export interface IAxiosResponse<T> extends AxiosResponse {
	status: number;
	data: T;
	message?: string;
	error?: string;
	[key: string]: any;
}
const env = import.meta.env.DEV;

export interface RequestConfig extends AxiosRequestConfig {
	closeErrorMessage?: boolean;
	successStatusCheckValue?: number | 'none';
	header?: Record<string, any>;
}

/**
 * GET 一个示例: GET('/edit', { name: 'libai' }, { baseUrl: 'www.baidu.com' })
 * @param url
 * @param params
 * @param config
 */
export function GET<T, K = any>(url: string, params?: T, config?: AxiosRequestConfig): Promise<IAxiosResponse<K>> {
	return http.get<K>(url, { ...config, params }).catch(error => {
		if (env) {
			console.error('GET接口请求异常。下面是请求参数和异常信息：');
			console.error(url);
			console.error(error);
		}

		if (error.response?.status === 400) {
			// 刷新频率过高
			message.error(`${error.response?.data?.message || '请求失败，请重试'}`);
		} else {
			message.error(`${(error && (error.error || error.message || error.msg)) || '请求失败，请重试'}`);
		}
		return Promise.reject(error);
	});
}

/**
 * POST 一个示例: POST('/edit', { name: 'libai' }, { params: { id: 2 } })
 * @param url
 * @param data
 * @param config
 */
export function POST<T, K = any>(url: string, data?: T, config?: AxiosRequestConfig): Promise<IAxiosResponse<K>> {
	return http.post<K>(url, data, config).catch(error => {
		if (env) {
			console.error('POST接口请求异常。下面是请求参数和异常信息：');
			console.error(url);
			console.error(error);
		}

		if (error.response?.status === 400) {
			// 刷新频率过高
			message.error(`${error.response?.data?.message || '请求失败，请重试'}`);
		} else {
			message.error(`${(error && (error.error || error.message || error.msg)) || '请求失败，请重试'}`);
		}
		return Promise.reject(error);
	});
}
