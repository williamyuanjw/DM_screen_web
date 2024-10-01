import resquet from '../../service/service';
// Ts类型
interface CommResponse {
	code: number;
	mes: string;
	data: any;
}

interface LoginResponse extends CommResponse {
	data: {
		token: string;
	};
}

export const login = (params: { username: string; password: number }) => {
	return resquet.post<LoginResponse>('/login', params);
};
