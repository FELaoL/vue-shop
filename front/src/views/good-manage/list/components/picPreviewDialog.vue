<template>
	<!-- 图片预览 -->
	<el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
		<img :src="previewUrl" alt="" class="previewImg" />
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
