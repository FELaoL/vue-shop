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
const Orders = () => import(/* webpackChunkName: "orders_reports" */ "./../views/order-manage/list");
const Reports = () => import(/* webpackChunkName: "orders_reports" */ "./../views/data-statistics/report");
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
			},
			{
				path: "/orders",
				component: Orders
			},
			{
				path: "/reports",
				component: Reports
			}
		]
	}
];

const router = new VueRouter({
	routes
});

// ????????????????????????
router.beforeEach((to, from, next) => {
	// to?????????????????????
	// from ?????????????????????????????????
	// next ??????????????????????????????
	// next() ?????? next("/login") ????????????
	if (to.path === "/login") return next();
	// ??????token
	const tokenStr = window.sessionStorage.getItem("token");
	if (!tokenStr) return next("/login");
	next();
});

export default router;
