import { POST } from '@/service/api';

export const login = (params: { user_name: string; pass_word: string }) => {
	return POST('/common/login', params);
};
