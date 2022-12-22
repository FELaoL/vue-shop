<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="addCategory">添加分类</el-button>
				</el-col>
			</el-row>
			<!-- 表格 -->
			<tree-table
				:data="categoryList"
				:columns="columns"
				:selection-type="false"
				:expand-type="false"
				:show-index="true"
				index-text="#"
				border
				:show-row-hover="false"
				class="tree-table"
			>
				<!-- 是否有效 -->
				<template slot="catDeleted" slot-scope="scope">
					<i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
					<i class="el-icon-error" v-else style="color: red"></i>
				</template>
				<!-- 排序 -->
				<template slot="catLevel" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
					<el-tag type="success" v-else-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
					<el-tag type="warning" v-else size="mini">三级</el-tag>
				</template>
				<!-- 操作 -->
				<template slot="action" slot-scope="scope">
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="updateCategory(scope.row.cat_id)"
						>编辑</el-button
					>
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCategory(scope.row.cat_id)"
						>删除</el-button
					>
				</template>
			</tree-table>
			<!-- 分页区域 -->
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryParams.pagenum"
				:page-sizes="[3, 5, 10, 15]"
				:page-size="queryParams.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>
		<category-dialog v-if="categoryVisible" ref="categoryRef" @refresh="getThreeCategoryList"></category-dialog>
	</div>
</template>

<script>
import categoryDialog from "./components/categoryDialog";
export default {
	components: {
		categoryDialog
	},
	data() {
		return {
			// 商品分类的数据列表，默认为空
			categoryList: [],
			// 总数据条数
			total: 0,
			// 查询条件
			queryParams: {
				type: 3,
				pagenum: 1,
				pagesize: 5
			},
			// 为table指定列的定义
			columns: [
				{
					label: "分类名称",
					prop: "cat_name"
				},
				{
					label: "是否有效",
					key: "cat_deleted",
					// 表示，将当前列定义为模板列
					type: "template",
					// 表示当前这一列使用的模板名称
					template: "catDeleted"
				},
				{
					label: "排序",
					key: "cat_level",
					// 表示，将当前列定义为模板列
					type: "template",
					// 表示当前这一列使用的模板名称
					template: "catLevel"
				},
				{
					title: "操作",
					// 表示，将当前列定义为模板列
					type: "template",
					// 表示当前这一列使用的模板名称
					template: "action"
				}
			],
			categoryVisible: false
		};
	},
	methods: {
		// 获取商品分类数据
		async getThreeCategoryList() {
			const { data: res } = await this.$http.get("categories", { params: this.queryParams });
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			// 把数据列表赋值给categoryList
			this.categoryList = res.data.result;
			// 为总数据条数赋值
			this.total = res.data.total;
		},
		// 监听 pagesize改变
		handleSizeChange(pagesize) {
			this.queryParams.pagesize = pagesize;
			this.getThreeCategoryList();
		},
		// 监听pagenum改变
		handleCurrentChange(pagenum) {
			this.queryParams.pagenum = pagenum;
			this.getThreeCategoryList();
		},
		// 点击按钮，展示添加分类的对话框
		addCategory() {
			// 展示对话框;
			this.categoryVisible = true;
			this.$nextTick(() => {
				this.$refs.categoryRef.categoryDialogVisible = true;
				this.$refs.categoryRef.init("添加分类");
			});
		},
		async updateCategory(catId) {
			const { data: res } = await this.$http.get("categories/" + catId);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.categoryVisible = true;
			this.$nextTick(() => {
				this.$refs.categoryRef.categoryDialogVisible = true;
				this.$refs.categoryRef.init("编辑分类", res.data);
			});
		},
		async removeCategory(catId) {
			const confirmResult = await this.$confirm("此操作将永久删除该商品分类, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).catch(err => err);
			if (confirmResult !== "confirm") return this.$message.info("已取消删除");
			const { data: res } = await this.$http.delete("categories/" + catId);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.getThreeCategoryList();
		}
	},
	created() {
		this.getThreeCategoryList();
	}
};
</script>

<style lang="less" scoped>
.tree-table {
	margin-top: 15px;
}
</style>
