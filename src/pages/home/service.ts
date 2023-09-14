import { GET } from '@/service/api';

export const getOptions = () => {
	return GET('/home/getOptions');
};

export const getInit = () => {
	return GET('/home/getInitData');
};

export const getGithubData = (params: { page: number; page_size: number }) => {
	return GET('/home/getGithubData', params);
};

export const getProjectData = (params: { type: string; project_id: number }) => {
	return GET('/home/getProjectData', params);
};
