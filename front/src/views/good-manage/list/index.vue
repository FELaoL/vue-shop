<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getGoodList">
						<el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addGood">添加商品</el-button>
				</el-col>
			</el-row>
			<!-- table表格区域 -->
			<el-table border stripe :data="goodList">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="goods_name" label="商品名称"></el-table-column>
				<el-table-column prop="goods_price" label="商品价格（元）" width="95px"></el-table-column>
				<el-table-column prop="goods_weight" label="商品重量" width="70px"></el-table-column>
				<el-table-column prop="add_time" label="创建时间" width="140px">
					<template slot-scope="scope">
						{{ scope.row.add_time | dateFormat }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="130px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="editGood(scope.row.goods_id)"></el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGood(scope.row.goods_id)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页区域 -->
			<el-pagination
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryParams.pagenum"
				:page-sizes="[5, 10, 15, 20]"
				:page-size="queryParams.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 商品列表
			goodList: [],
			// 总数据条数
			total: 0,
			// 查询参数对象
			queryParams: {
				query: "",
				pagenum: 1,
				pagesize: 10
			}
		};
	},
	methods: {
		// 根据分页获取对应的商品列表
		async getGoodList() {
			const { data: res } = await this.$http.get("goods", {
				params: this.queryParams
			});
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.goodList = res.data.goods;
			this.total = res.data.total;
		},
		handleSizeChange(pageSize) {
			this.queryParams.pagesize = pageSize;
			this.getGoodList();
		},
		handleCurrentChange(currentPage) {
			this.queryParams.pagenum = currentPage;
			this.getGoodList();
		},
		async removeGood(goodId) {
			const confirmResult = await this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).catch(err => err);
			if (confirmResult !== "confirm") return this.$message.info("已取消删除");

			const { data: res } = await this.$http.delete("goods/" + goodId);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.getGoodList();
		},
		// 添加商品
		addGood() {
			this.$router.push("/goods/add");
		},
		// 编辑商品
		editGood(goodId) {
			this.$router.push({ path: "/goods/add", query: { goodId } });
		}
	},
	computed: {},
	created() {
		this.getGoodList();
	}
};
</script>

<style lang="less" scoped></style>
