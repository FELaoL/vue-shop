<template>
	<!-- 添加参数的对话框 -->
	<el-dialog
		:title="(!attrForm.attr_id ? '添加' : '修改') + attrDialogTitle"
		:visible.sync="attrDialogVisible"
		width="50%"
		@close="handleAttrDialogClosed"
	>
		<el-form ref="attrFormRef" :model="attrForm" :rules="attrFormRules" label-width="100px">
			<el-form-item :label="attrDialogTitle" prop="attr_name">
				<el-input v-model="attrForm.attr_name"></el-input>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<span class="dialog-footer">
				<el-button @click="attrDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrUpdateAttr">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			// 操作参数的变量
			// 控制添加对话框的显示和隐藏
			attrDialogVisible: false,
			// 添加参数的表单数据对象
			attrForm: {
				attr_name: ""
			},
			// 添加参数的表单数据对象
			attrFormRules: {
				attr_name: [{ required: true, message: "请输入参数/属性名称", trigger: "blur" }]
			},
			activeName: null,
			catId: null,
			isAddAttr: true
		};
	},
	computed: {
		// 动态计算标题的文本
		attrDialogTitle() {
			if (this.activeName === "many") return "动态参数";
			else return "静态属性";
		}
	},
	methods: {
		init(activeName, catId, data) {
			this.activeName = activeName;
			this.catId = catId;
			if (data) this.attrForm = data;
		},
		// 监听对话框的关闭事件
		handleAttrDialogClosed() {
			this.attrForm = {
				attr_name: ""
			};
			this.$refs.attrFormRef.resetFields();
		},
		// 点击按钮，添加参数
		addOrUpdateAttr() {
			this.$refs.attrFormRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = !this.attrForm.attr_id
					? await this.$http.post(`categories/${this.catId}/attributes`, {
							attr_name: this.attrForm.attr_name,
							attr_sel: this.activeName,
							attr_vals: ""
					  })
					: await this.$http.put(`categories/${this.catId}/attributes/${this.attrForm.attr_id}`, {
							attr_name: this.attrForm.attr_name,
							attr_sel: this.attrForm.attr_sel,
							attr_vals: this.attrForm.attr_vals ? this.attrForm.attr_vals : ""
					  });
				if ((!this.attrForm.attr_id && res.meta.status !== 201) || (!!this.attrForm.attr_id && res.meta.status !== 200))
					return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				this.attrDialogVisible = false;
				this.$emit("refresh");
			});
		}
	}
};
</script>

<style lang="less" scoped></style>
