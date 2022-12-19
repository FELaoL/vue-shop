<template>
	<el-dialog :title="userDialogTitle" :visible.sync="userDialogVisible" width="50%" @close="handleUserDialogClose">
		<!--内容主体区域 -->
		<el-form :model="userForm" :rules="userFormRules" ref="userFormRef" label-width="70px">
			<el-form-item label="用户名" :prop="!userForm.id ? 'username' : ''">
				<el-input v-model="userForm.username" :disabled="userForm.id"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password" v-if="!userForm.id">
				<el-input v-model="userForm.password"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="userForm.email"></el-input>
			</el-form-item>
			<el-form-item label="手机号" prop="mobile">
				<el-input v-model="userForm.mobile"></el-input>
			</el-form-item>
		</el-form>
		<!-- 底部区域 -->
		<span slot="footer" class="dialog-footer">
			<el-button @click="userDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addOrUpdateUser">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	data() {
		// 验证手机号的规则
		const checkMobile = (rule, value, cb) => {
			// 验证手机号的正则表达式
			const mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
			if (mobileReg.test(value)) return cb();
			cb(new Error("手机号格式不正确！"));
		};
		// 验证邮箱的规则
		const checkEmail = (rule, value, cb) => {
			// 验证邮箱的正则表达式
			const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
			// 合法邮箱
			if (emailReg.test(value)) return cb();
			cb(new Error("邮箱格式不正确！"));
		};
		return {
			// 控制用户对话框的显示和隐藏
			userDialogVisible: false,
			userDialogTitle: "添加用户",
			// 用户的表单数据
			userForm: {
				username: "",
				password: "",
				email: "",
				mobile: ""
			},
			// 表单的验证规则对象
			userFormRules: {
				username: [
					{
						required: true,
						message: "请输入用户名",
						trigger: "blur"
					},
					{
						min: 3,
						max: 10,
						message: "长度在 3 到 10 个字符",
						trigger: "blur"
					}
				],
				password: [
					{
						required: true,
						message: "请输入密码",
						trigger: "blur"
					},
					{
						min: 6,
						max: 15,
						message: "长度在 6 到 15 个字符",
						trigger: "blur"
					}
				],
				email: [
					{
						required: true,
						message: "请输入邮箱",
						trigger: "blur"
					},
					{ validator: checkEmail, trigger: "blur" }
				],
				mobile: [
					{
						required: true,
						message: "请输入手机号",
						trigger: "blur"
					},
					{ validator: checkMobile, trigger: "blur" }
				]
			}
		};
	},
	methods: {
		// 监听用户对话框的关闭事件
		handleUserDialogClose() {
			this.userForm = {};
			this.$refs.userFormRef.resetFields();
		},
		// 点击按钮，添加或修改用户
		addOrUpdateUser() {
			this.$refs.userFormRef.validate(async valid => {
				if (!valid) return;
				// 可以发起操作用户的网络请求
				const { data: res } = !this.userForm.id
					? await this.$http.post("users", this.userForm)
					: await this.$http.put("users/" + this.userForm.id, {
							email: this.userForm.email,
							mobile: this.userForm.mobile
					  });
				if ((!this.userForm.id && res.meta.status !== 201) || (this.userForm.id && res.meta.status !== 200)) return this.$message.error(res.meta.msg);
				// 提示成功
				this.$message.success(res.meta.msg);
				// 重新获取用户列表数据
				this.$emit("refresh");
				// 隐藏添加用户的对话框
				this.userDialogVisible = false;
			});
		}
	}
};
</script>
