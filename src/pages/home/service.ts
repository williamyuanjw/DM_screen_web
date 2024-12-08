import { GET } from '@/service/api';

export const getInit = () => {
	return GET('/home/getInitData');
};

export const getGithubData = (params: { page: number; page_size: number }) => {
	return GET('/home/getGithubData', params);
};

export const getProjectData = (params: { type: string; project_id: number }) => {
	return GET('/home/getProjectData', params);
};
export const getProjectList = () => {
	return GET('/getGithub');
};
export const getCommits = () => {
	return GET('/codeCommit');
};
/**
 * @description 过去12个月代码的添加数和删除数
 * @return Additions
 * @return Deletions
 */
export const getCodeCommit = () => {
	return GET('/codeFrequency');
};
export const getWorldMap = () => {
	return GET('/getWorldMap');
};
