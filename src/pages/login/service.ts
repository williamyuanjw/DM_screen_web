import resquet from '../../service/service';
// Ts类型
interface CommResponse {
	code: number;
	mes: string;
	data: any;
}

interface LoginResponse extends CommResponse {
	msg: string;
}

export const login = (params: { username: string; password: string }) => {
	return resquet.post<LoginResponse>('/login', params);
};
