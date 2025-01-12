<template>
	<!-- 物流进度的对话框 -->
	<el-dialog :visible.sync="logisticsDialogVisible" title="物流进度" width="50%" @close="handleLogisticsDialogClosed">
		<el-timeline>
			<template v-for="(logistics, index) in logisticsData">
				<el-timeline-item :key="index" :timestamp="logistics.time">
					{{ logistics.context }}
				</el-timeline-item>
			</template>
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
