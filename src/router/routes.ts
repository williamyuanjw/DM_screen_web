import loginRouter from './login';
import HomeRouter from './home';

const routes = [
	{
		path: '/',
		redirect: '/login'
	},
	...loginRouter,
	...HomeRouter
];

export default routes;
