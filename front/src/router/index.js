import Vue from "vue";
import VueRouter from "vue-router";
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ "./../views/Login.vue");
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ "./../views/Home.vue");
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ "./../views/Welcome.vue");
const User = () => import(/* webpackChunkName: "users_rights_roles" */ "./../views/user-manage/user");
const Power = () => import(/* webpackChunkName: "users_rights_roles" */ "./../views/permission-manage/power");
const Role = () => import(/* webpackChunkName: "users_rights_roles" */ "./../views/permission-manage/role");
const Categories = () => import(/* webpackChunkName: "categories_params_goods_addgood" */ "./../views/good-manage/category");
const Params = () => import(/* webpackChunkName: "categories_params_goods_addgood" */ "./../views/good-manage/parameter");
const Goods = () => import(/* webpackChunkName: "categories_params_goods_addgood" */ "./../views/good-manage/list");
const AddGood = () => import(/* webpackChunkName: "categories_params_goods_addgood" */ "./../views/good-manage/list/editGood");
Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		redirect: "/login"
	},
	{
		path: "/login",
		component: Login
	},
	{
		path: "/home",
		component: Home,
		redirect: "/welcome",
		children: [
			{
				path: "/welcome",
				component: Welcome
			},
			{
				path: "/users",
				component: User
			},
			{
				path: "/rights",
				component: Power
			},
			{
				path: "/roles",
				component: Role
			},
			{
				path: "/categories",
				component: Categories
			},
			{
				path: "/params",
				component: Params
			},
			{
				path: "/goods",
				component: Goods
			},
			{
				path: "/goods/add",
				component: AddGood
			}
		]
	}
];

const router = new VueRouter({
	routes
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
	// to将要访问的路径
	// from 代表从哪个路径跳转而来
	// next 是一个函数，表示放行
	// next() 放行 next("/login") 强制跳转
	if (to.path === "/login") return next();
	// 获取token
	const tokenStr = window.sessionStorage.getItem("token");
	if (!tokenStr) return next("/login");
	next();
});

export default router;
