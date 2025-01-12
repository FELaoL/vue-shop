<template>
	<!-- 修改地址的对话框 -->
	<el-dialog :visible.sync="addressDialogVisible" title="修改地址" width="50%" @close="handleAddressDialogClosed">
		<el-form ref="addressFormRef" :model="addressForm" :rules="addressFormRules" label-width="100px">
			<el-form-item label="省市区/县" prop="cgn_pcc">
				<el-cascader v-model="addressForm.cgn_pcc" :options="citydata" placeholder="请选择" clearable></el-cascader>
			</el-form-item>
			<el-form-item label="详细地址" prop="cgn_address">
				<el-input v-model="addressForm.cgn_address"></el-input>
			</el-form-item>
		</el-form>
		<template slot="footer">
			<span class="dialog-footer">
				<el-button @click="addressDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="aUAddress">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
import citydata from "./citydata";
import _ from "lodash";
export default {
	data() {
		return {
			// 修改地址用到的变量
			addressDialogVisible: false,
			addressForm: {
				cgn_pcc: [],
				cgn_address: ""
			},
			addressFormRules: {
				cgn_pcc: [{ required: true, message: "请选择省市区/县", trigger: "blur" }],
				cgn_address: [{ required: true, message: "请输入详细地址", trigger: "blur" }]
			},
			citydata
		};
	},
	methods: {
		init(data) {
			this.addressForm = data;
		},
		handleAddressDialogClosed() {
			this.addressForm.cgn_code = [];
			this.$refs.addressFormRef.resetFields();
		},
		aUAddress() {
			this.$refs.addressFormRef.validate(async valid => {
				if (!valid) return;
				const form = _.cloneDeep(this.addressForm);
				form.cgn_pcc = form.cgn_pcc.join(" ");
				const { data: res } = await this.$http.put(`orders/${this.addressForm.order_id}`, form);
				if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				this.addressDialogVisible = false;
				this.$emit("refresh");
			});
		}
	}
};
</script>

<style lang="less" scoped>
.el-cascader {
	width: 100%;
}
</style>
