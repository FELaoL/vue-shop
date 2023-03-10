import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import "./plugins/element.js";
// 导入字体图标
import "./assets/fonts/iconfont.css";
// 导入全局样式表
import "./assets/css/global.css";
import TreeTable from "vue-table-with-tree-grid";
// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器对应的样式
// import "quill/dist/quill.core.css"; // import styles
// import "quill/dist/quill.snow.css"; // for snow theme
// import "quill/dist/quill.bubble.css"; // for bubble theme

// 导入NProgress包对应的js和css
import NProgress from "nprogress";
// import "nprogress/nprogress.css";
import axios from "axios";
// 配置请求的根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// axios请求拦截
// 在request拦截器中，展示进度条
axios.interceptors.request.use(config => {
	NProgress.start();
	config.headers.Authorization = window.sessionStorage.getItem("token");
	// 在最后必须return config;
	return config;
});
// 在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
	NProgress.done();
	return config;
});
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.component("tree-table", TreeTable);
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor);

Vue.filter("dateFormat", function (longTime) {
	const date = new Date(longTime);

	const y = date.getFullYear();
	const m = (date.getMonth() + 1 + "").padStart(2, "0");
	const d = (date.getDate() + "").padStart(2, "0");

	const hh = (date.getHours() + "").padStart(2, "0");
	const mm = (date.getMinutes() + "").padStart(2, "0");
	const ss = (date.getSeconds() + "").padStart(2, "0");

	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
	router,
	render: h => h(App)
}).$mount("#app");
