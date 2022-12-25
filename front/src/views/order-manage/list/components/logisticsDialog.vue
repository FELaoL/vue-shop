<template>
	<!-- 物流进度的对话框 -->
	<el-dialog title="物流进度" :visible.sync="logisticsDialogVisible" @close="handleLogisticsDialogClosed" width="50%">
		<el-timeline>
			<el-timeline-item v-for="(logistics, index) in logisticsData" :key="index" :timestamp="logistics.time">
				{{ logistics.context }}
			</el-timeline-item>
		</el-timeline>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			logisticsDialogVisible: false,
			logisticsData: []
		};
	},
	methods: {
		init(data) {
			this.logisticsData = data;
		},
		handleLogisticsDialogClosed() {
			this.logisticsData = [];
		}
	}
};
</script>

<style lang="less" scoped></style>
