<template>
	<!-- 分配权限的对话框 -->
	<el-dialog :title="allotRoleDialogTitle" :visible.sync="allotRoleDialogVisible" width="50%" @close="handleAllotRoleDialogClose">
		<div>
			<p>当前的用户：{{ userForm.username }}</p>
			<p>当前的角色：{{ userForm.role_name }}</p>
			<p>
				分配新角色：
				<el-select v-model="roleId" placeholder="请选择">
					<el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
				</el-select>
			</p>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="allotRoleDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="allotRole">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			// 分配角色
			allotRoleDialogTitle: "分配角色",
			// 控制分配角色对话框的显示和隐藏
			allotRoleDialogVisible: false,
			// 所有角色的数据列表
			roleList: [],
			// 已选中的角色id值
			roleId: "",
			// 需要被分配角色的用户信息
			userForm: {}
		};
	},
	methods: {
		async init(userInfo) {
			this.userForm = userInfo;
			// 在展示对话框之前，获取所有角色的列表
			const { data: res } = await this.$http.get("roles");
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.roleList = res.data;
		},
		// 监听分配角色对话框的关闭事件
		handleAllotRoleDialogClose() {
			this.roleId = "";
			this.userForm = {};
		},
		// 点击按钮，分配角色
		async allotRole() {
			if (!this.roleId) return this.$message.info("请选择角色");
			const { data: res } = await this.$http.put(`users/${this.userForm.id}/role`, { rid: this.roleId });
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.allotRoleDialogVisible = false;
			this.$emit("refresh");
		}
	}
};
</script>
