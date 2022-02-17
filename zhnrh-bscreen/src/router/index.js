import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
	{
		//首页
		path: '/',
		name: 'home',
		component: () => import('../views/home.vue'),
	},
	{
		//404页面的路由
		path: '/:path(.*)',
		name: '404',
		component: () => import('../views/404.vue'),
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
