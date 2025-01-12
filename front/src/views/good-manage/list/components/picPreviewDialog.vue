<template>
	<!-- 图片预览 -->
	<el-dialog :visible.sync="dialogVisible" title="图片预览" width="50%">
		<img class="previewImg" :src="previewUrl" alt="" />
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			previewUrl: "",
			dialogVisible: false
		};
	},
	methods: {
		init(previewUrl) {
			this.previewUrl = previewUrl;
		}
	}
};
</script>

<style lang="less" scoped>
.previewImg {
	width: 100%;
}
</style>
