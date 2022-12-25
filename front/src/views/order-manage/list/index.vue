<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>订单管理</el-breadcrumb-item>
			<el-breadcrumb-item>订单列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryParams.query" clearable @clear="getOrderList">
						<el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
					</el-input>
				</el-col>
			</el-row>

			<!-- 订单列表数据 -->
			<el-table border stripe :data="orderList">
				<el-table-column type="index"></el-table-column>
				<el-table-column prop="order_number" label="订单编号"></el-table-column>
				<el-table-column prop="order_price" label="订单价格"></el-table-column>
				<el-table-column prop="pay_status" label="是否付款">
					<template slot-scope="scope">
						<el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
						<el-tag type="danger" v-else>未付款</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="is_send" label="是否发货"></el-table-column>
				<el-table-column prop="create_time" label="下单时间">
					<template slot-scope="scope">
						{{ scope.row.create_time | dateFormat }}
					</template>
				</el-table-column>
				<el-table-column prop="order_number" label="操作">
					<template slot-scope="scope">
						<el-button
							type="primary"
							icon="el-icon-edit"
							size="mini"
							@click="updateAddress(scope.row.order_id)"
						></el-button>
						<el-button
							type="success"
							icon="el-icon-location"
							size="mini"
							@click="lookLogistics(scope.row.trade_no)"
						></el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页区域 -->
			<el-pagination
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryParams.pagenum"
				:page-sizes="[5, 10, 15, 20, 30]"
				:page-size="queryParams.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</el-card>

		<address-dialog ref="addressRef" v-if="addressVisible" @refresh="getOrderList"></address-dialog>
		<logistics-dialog ref="logisticsRef" v-if="logisticsVisible" @refresh="getOrderList"></logistics-dialog>
	</div>
</template>

<script>
import addressDialog from "./components/addressDialog.vue";
import logisticsDialog from "./components/logisticsDialog.vue";

export default {
	components: {
		addressDialog,
		logisticsDialog
	},
	data() {
		return {
			queryParams: {
				query: "",
				pagenum: 1,
				pagesize: 10
			},
			orderList: [],
			total: 0,
			addressVisible: false,
			logisticsVisible: false
		};
	},
	methods: {
		async getOrderList() {
			const { data: res } = await this.$http.get("orders", {
				params: this.queryParams
			});
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.orderList = res.data.orders;
			this.total = res.data.total;
		},
		handleSizeChange(pageSize) {
			this.queryParams.pagesize = pageSize;
			this.getOrderList();
		},
		handleCurrentChange(currentPage) {
			this.queryParams.pagenum = currentPage;
			this.getOrderList();
		},
		async updateAddress(orderId) {
			const { data: res } = await this.$http.get(`orders/${orderId}`);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			let data = {};
			if (res.data.consignee) {
				res.data.consignee.cgn_pcc =
					res.data.consignee && res.data.consignee.cgn_pcc ? res.data.consignee.cgn_pcc.split(" ") : [];
				data = res.data.consignee;
			} else {
				data.order_id = res.data.order_id;
			}
			this.addressVisible = true;
			this.$nextTick(() => {
				this.$refs.addressRef.addressDialogVisible = true;
				this.$refs.addressRef.init(data);
			});
		},
		async lookLogistics(tradeNo) {
			const { data: res } = await this.$http.get(`/kuaidi/${tradeNo}`);
			if (res.meta.status !== 200) return this.$message.error(res.meta.message);
			this.$message.success(res.meta.message);
			this.logisticsVisible = true;
			this.$nextTick(() => {
				this.$refs.logisticsRef.logisticsDialogVisible = true;
				this.$refs.logisticsRef.init(res.data);
			});
		}
	},
	created() {
		this.getOrderList();
	}
};
</script>

<style lang="less" scoped></style>
