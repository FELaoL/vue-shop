import Vue from "vue";
import { Button, FormItem, Form, Input, Message } from "element-ui";

Vue.use(Button);
Vue.use(FormItem);
Vue.use(Form);
Vue.use(Input);
// 导入弹框提示组件
Vue.prototype.$message = Message;
