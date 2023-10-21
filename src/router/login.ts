const Login = () => import('@/pages/login/index.vue');

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			title: '开源数据发展趋势-登录页'
		}
	}
];

export default routes;
