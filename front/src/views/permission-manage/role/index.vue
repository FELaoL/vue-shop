<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 添加角色按钮区域 -->
			<el-row>
				<el-col>
					<el-button type="primary" @click="addRole">添加角色</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表区域 -->
			<el-table :data="roleList" border stripe>
				<!-- 展开列 -->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<template v-for="(item1, index1) in scope.row.children">
							<el-row :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']" :key="item1.id">
								<!-- 渲染一级权限 -->
								<el-col :span="5">
									<el-tag closable @close="removeRight(scope.row, item1.id)">{{ item1.authName }}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<!-- 渲染二级和三级权限 -->
								<el-col :span="19">
									<!-- 通过for循环，嵌套渲染二级权限 -->
									<template v-for="(item2, index2) in item1.children">
										<el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']" :key="item2.id">
											<el-col :span="6">
												<el-tag type="success" closable @close="removeRight(scope.row, item2.id)">{{
													item2.authName
												}}</el-tag>
												<i class="el-icon-caret-right"></i>
											</el-col>
											<el-col :span="18">
												<template v-for="item3 in item2.children">
													<el-tag
														:key="item3.id"
														type="warning"
														closable
														@close="removeRight(scope.row, item3.id)"
														>{{ item3.authName }}</el-tag
													>
												</template>
											</el-col>
										</el-row>
									</template>
								</el-col>
							</el-row>
						</template>
					</template>
				</el-table-column>
				<!-- 索引列 -->
				<el-table-column type="index"> </el-table-column>
				<el-table-column prop="roleName" label="角色名称"> </el-table-column>
				<el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
				<el-table-column label="操作" width="300px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editRole(scope.row.id)">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"
							>分配角色</el-button
						>
					</template>
				</el-table-column>
			</el-table>
			<template v-if="roleVisible">
				<role-dialog ref="roleRef" @refresh="getRoleList"></role-dialog>
			</template>
			<template v-if="powerVisible">
				<power-dialog ref="powerRef" @refresh="getRoleList"></power-dialog>
			</template>
		</el-card>
	</div>
</template>

<script>
import roleDialog from "./components/roleDialog.vue";
import powerDialog from "./components/powerDialog.vue";
export default {
	components: {
		roleDialog,
		powerDialog
	},
	data() {
		return {
			// 所有角色列表数据
			roleList: [],
			roleVisible: false,
			powerVisible: false
		};
	},
	methods: {
		// 获取所有角色列表
		async getRoleList() {
			const { data: res } = await this.$http.get("roles");
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.roleList = res.data;
		},
		// 用户操作的方法
		addRole() {
			this.roleVisible = true;
			this.$nextTick(() => {
				this.$refs.roleRef.roleDialogVisible = true;
				this.$refs.roleRef.init("添加角色");
			});
		},
		async editRole(roleId) {
			const { data: res } = await this.$http.get("roles/" + roleId);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.roleVisible = true;
			this.$nextTick(() => {
				this.$refs.roleRef.roleDialogVisible = true;
				this.$refs.roleRef.init("修改角色", res.data);
			});
		},
		async removeRole(roleId) {
			const confirmResult = await this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).catch(err => err);
			if (confirmResult !== "confirm") return this.$message.info("已取消删除");
			const { data: res } = await this.$http.delete("roles/" + roleId);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.getRoleList();
		},
		// 根据id删除对应的权限
		async removeRight(role, rid) {
			// 弹框提示用户是否要删除
			const confirmResult = await this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).catch(err => err);
			if (confirmResult !== "confirm") return this.$message.info("已取消删除");
			const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rid}`);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			role.children = res.data;
		},
		// 分配权限
		// 展示分配权限的对话框
		async showSetRightDialog(role) {
			this.powerVisible = true;
			this.$nextTick(() => {
				this.$refs.powerRef.allotRightDialogVisible = true;
				this.$refs.powerRef.init(role);
			});
		}
	},
	created() {
		this.getRoleList();
	}
};
</script>

<style lang="less" scoped>
.el-tag {
	margin: 7px;
}
.bdtop {
	border-top: 1px solid #eee;
}
.bdbottom {
	border-bottom: 1px solid #eee;
}
.vcenter {
	display: flex;
	align-items: center;
}
</style>
