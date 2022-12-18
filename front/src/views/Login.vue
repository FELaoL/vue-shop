<template>
	<div class="login_container">
		<div class="login_box">
			<!-- 头像区域 -->
			<div class="avatar_box">
				<img src="./../assets/logo.png" alt="" />
			</div>
			<!-- 登录表单区域 -->
			<el-form
				class="login_form"
				:model="loginForm"
				:rules="loginFormRules"
				ref="loginFormRef"
				label-width="0px"
			>
				<!-- 用户名 -->
				<el-form-item prop="username">
					<el-input
						prefix-icon="iconfont icon-user"
						v-model="loginForm.username"
					></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input
						prefix-icon="iconfont icon-3702mima"
						v-model="loginForm.password"
						type="password"
					></el-input>
				</el-form-item>
				<!-- 按钮区域 -->
				<el-form-item class="btns">
					<el-button type="primary" @click="login"
						>登录</el-button
					>
					<el-button type="info" @click="resetLoginForm"
						>重置</el-button
					>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 这是登录表单的数据绑定对象
			loginForm: {
				username: "admin",
				password: "123456"
			},
			// 这是表单的验证规则对象
			loginFormRules: {
				// 验证用户名是否合法
				username: [
					{
						required: true,
						message: "请输入登录名称",
						trigger: "blur"
					},
					{
						min: 3,
						max: 10,
						message: "长度在 3 到 10 个字符",
						trigger: "blur"
					}
				],
				// 验证密码是否合法
				password: [
					{
						required: true,
						message: "请输入登录密码",
						trigger: "blur"
					},
					{
						min: 6,
						max: 15,
						message: "长度在 6 到 15 个字符",
						trigger: "blur"
					}
				]
			}
		};
	},
	methods: {
		// 点击重置按钮，重置登录表单
		resetLoginForm() {
			this.$refs.loginFormRef.resetFields();
		},
		login() {
			this.$refs.loginFormRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = await this.$http.post(
					"login",
					this.loginForm
				);
				if (res.meta.status !== 200)
					return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				// 1.将登录成功过之后的token，保存到客户端的sessionStorage中
				// 1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
				// 1.2 token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
				window.sessionStorage.setItem("token", res.data.token);
				// 2.通过编程式导航跳转到后台主页，路由地址是 /home
				this.$router.push("/home");
			});
		}
	}
};
</script>

<style scoped lang="less">
.login_container {
	background-color: #2b4b6b;
	height: 100%;

	.login_box {
		width: 450px;
		height: 300px;
		background-color: #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 3px;

		.avatar_box {
			width: 130px;
			height: 130px;
			border-radius: 50%;
			padding: 10px;
			border: 1px solid #eee;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: #fff;
			box-shadow: 0 0 10px #ddd;

			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}

		.login_form {
			position: absolute;
			bottom: 0;
			padding: 0 20px;
			// 规定两个并排的带边框的框：
			// border_box 为元素设定的宽度和高度决定了元素的边框盒。
			// 就是说，为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。
			// 通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。
			box-sizing: border-box;
			width: 100%;

			.btns {
				display: flex;
				// justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式。
				// flex-end 项目位于容器的结尾。
				justify-content: flex-end;
			}
		}
	}
}
</style>
