<template>
	<!-- 角色操作的界面 -->
	<el-dialog :title="roleDialogTitle" :visible.sync="roleDialogVisible" width="50%" @close="handleRoleDialogClose">
		<el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="80px">
			<el-form-item label="角色名称" :prop="!roleForm.roleId ? 'roleName' : ''">
				<el-input v-model="roleForm.roleName" :disabled="roleForm.roleId"></el-input>
			</el-form-item>
			<el-form-item label="角色描述" prop="roleDesc">
				<el-input v-model="roleForm.roleDesc"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="roleDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addOrUpdateRole">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			// 角色操作
			roleDialogVisible: false,
			roleDialogTitle: "添加角色",
			roleForm: {
				roleName: "",
				roleDesc: ""
			},
			roleFormRules: {
				roleName: [
					{
						required: true,
						message: "请输入角色名称",
						trigger: "blur"
					}
				],
				roleDesc: [
					{
						required: false,
						message: "请输入角色描述",
						trigger: "blur"
					}
				]
			}
		};
	},
	methods: {
		init(title, data) {
			this.roleDialogTitle = title;
			this.roleForm = data || {};
		},
		handleRoleDialogClose() {
			this.roleForm = {};
			this.$refs.roleFormRef.resetFields();
		},
		addOrUpdateRole() {
			this.$refs.roleFormRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = !this.roleForm.roleId
					? await this.$http.post("roles", this.roleForm)
					: await this.$http.put("roles/" + this.roleForm.roleId, {
							roleName: this.roleForm.roleName,
							roleDesc: this.roleForm.roleDesc
					  });
				if ((!this.roleForm.roleId && res.meta.status !== 201) || (this.roleForm.roleId && res.meta.status !== 200)) return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				this.roleDialogVisible = false;
				this.$emit("refresh");
			});
		}
	}
};
</script>

<style lang="less" scoped></style>
