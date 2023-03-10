<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 搜索与添加区域 -->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addUser">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 用户列表区域 -->
			<el-table border stripe :data="userList">
				<el-table-column type="index"> </el-table-column>
				<el-table-column prop="username" label="姓名"> </el-table-column>
				<el-table-column prop="email" label="邮箱"> </el-table-column>
				<el-table-column prop="mobile" label="电话"> </el-table-column>
				<el-table-column prop="role_name" label="角色"> </el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"> </el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template slot-scope="scope">
						<!-- 修改按钮 -->
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
						<!-- 删除按钮 -->
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
						<!-- 分配角色按钮 -->
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							<el-button
								type="warning"
								icon="el-icon-setting"
								size="mini"
								@click="showAllotRoleDialog(scope.row)"
							></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[1, 2, 5, 10]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>
		<!-- 操作用户的对话框 -->
		<user-dialog v-if="userDialogVisible" ref="userDialogRef" @refresh="getUserList"></user-dialog>
		<role-dialog v-if="roleVisible" ref="roleRef" @refresh="getUserList"></role-dialog>
	</div>
</template>

<script>
import userDialog from "./components/userDialog.vue";
import roleDialog from "./components/roleDialog.vue";
export default {
	components: {
		userDialog,
		roleDialog
	},
	data() {
		return {
			// 获取用户列表的参数对象
			queryInfo: {
				query: "",
				// 当前的页数
				pagenum: 1,
				// 当前每页显示多少条数据
				pagesize: 2
			},
			userList: [],
			total: 0,
			// 控制用户对话框的显示和隐藏
			userDialogVisible: false,
			roleVisible: false
		};
	},
	created() {
		this.getUserList();
	},
	methods: {
		async getUserList() {
			const { data: res } = await this.$http.get("users", {
				params: this.queryInfo
			});
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.userList = res.data.users;
			this.total = res.data.total;
		},
		// 监听pagesize改变的事件
		handleSizeChange(newSize) {
			this.queryInfo.pagesize = newSize;
			this.getUserList();
		},
		// 监听页码值改变的事件
		handleCurrentChange(newPage) {
			this.queryInfo.pagenum = newPage;
			this.getUserList();
		},
		// 监听switch开关状态的改变
		async userStateChanged(userInfo) {
			const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
			if (res.meta.status !== 200) {
				userInfo.mg_state = !userInfo.mg_state;
				return this.$message.error(res.meta.msg);
			}
			this.$message.success(res.meta.msg);
		},
		addUser() {
			this.userDialogVisible = true;
			this.$nextTick(() => {
				this.$refs.userDialogRef.userDialogVisible = true;
				this.$refs.userDialogRef.init("添加用户");
			});
		},
		// 展示编辑用户的对话框
		async editUser(userId) {
			const { data: res } = await this.$http.get("users/" + userId);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.userDialogVisible = true;
			this.$nextTick(() => {
				this.$refs.userDialogRef.userDialogVisible = true;
				this.$refs.userDialogRef.init("修改用户", res.data);
			});
		},
		// 根据id按钮删除对应的用户信息
		async removeUser(userId) {
			// 弹框询问用户是否删除数据
			const confirmResult = await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).catch(err => err);
			// 如果用户确认删除，则返回值为字符串confirm
			// 如果用户取消了删除，则返回值为字符串cancel
			if (confirmResult !== "confirm") return this.$message.info("已取消删除");
			const { data: res } = await this.$http.delete("users/" + userId);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.getUserList();
		},
		// 展示分配角色的对话框
		showAllotRoleDialog(userInfo) {
			this.roleVisible = true;
			this.$nextTick(() => {
				this.$refs.roleRef.allotRoleDialogVisible = true;
				this.$refs.roleRef.init(userInfo);
			});
		}
	}
};
</script>
