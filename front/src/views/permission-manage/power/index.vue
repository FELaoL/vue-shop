<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<el-table :data="rightList" border stripe>
				<el-table-column type="index"> </el-table-column>
				<el-table-column prop="authName" label="权限名称"> </el-table-column>
				<el-table-column prop="path" label="路径"> </el-table-column>
				<el-table-column prop="level" label="权限等级">
					<template slot-scope="scope">
						<template v-if="scope.row.level === '0'"><el-tag>一级</el-tag></template>
						<template v-else-if="scope.row.level === '1'"><el-tag type="success">二级</el-tag></template>
						<template v-else><el-tag type="warning">三级</el-tag></template>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 权限列表
			rightList: []
		};
	},
	methods: {
		// 获取权限列表
		async getRightList() {
			const { data: res } = await this.$http.get("rights/list");
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.rightList = res.data;
		}
	},
	created() {
		// 获取所有的权限
		this.getRightList();
	}
};
</script>

<style lang="less" scoped></style>
