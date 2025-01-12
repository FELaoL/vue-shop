<template>
	<!-- 添加分类的对话框 -->
	<el-dialog :title="categoryDialogTitle" :visible.sync="categoryDialogVisible" width="50%" @close="handleCategoryDialogClosed">
		<!-- 添加分类的表单 -->
		<el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryFormRules" label-width="100px">
			<el-form-item label="分类名称" prop="cat_name">
				<el-input v-model="categoryForm.cat_name"></el-input>
			</el-form-item>
			<template v-if="!categoryForm.cat_id">
				<el-form-item label="父级分类">
					<!-- options用来指定数据源 -->
					<!-- props用来指定配置对象 -->
					<el-cascader
						v-model="catPid"
						:options="opCategoryList"
						:props="props"
						placeholder="请选择"
						clearable
						@change="handleChange"
					></el-cascader>
				</el-form-item>
			</template>
		</el-form>
		<template slot="footer">
			<span class="dialog-footer">
				<el-button @click="categoryDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrUpdateCategory">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			// 控制分类对话框的显示和隐藏
			categoryDialogTitle: "添加分类",
			categoryDialogVisible: false,
			// 分类的表单对象
			categoryForm: {
				// 父级分类的id
				cat_pid: 0,
				// 将要添加的分类的名称
				cat_name: "",
				// 分类的等级，默认要添加的
				cat_level: 0
			},
			// 添加分类表单的验证规则对象
			categoryFormRules: {
				cat_name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
			},
			// 父级分类的列表
			opCategoryList: [],
			// 指定级联选择器的配置对象
			props: {
				label: "cat_name",
				children: "children",
				value: "cat_id",
				// hover 触发子菜单
				expandTrigger: "hover",
				// 选择任意一级选项
				checkStrictly: true
			},
			// 选中的父级分类的id数组
			catPid: []
		};
	},
	methods: {
		init(title, data) {
			this.categoryDialogTitle = title;
			if (data) this.categoryForm = data;
			// 获取父级分类的数据列表
			this.getTwoCategoryList();
		},
		// 获取父级分类的数据列表
		async getTwoCategoryList() {
			const params = {
				type: 2
			};
			const { data: res } = await this.$http.get("categories", { params });
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.opCategoryList = res.data;
		},
		// 选择项发生变化触发这个函数
		handleChange() {
			// 如果 catpid数组中的length大于0，证明选中的父级分类
			// 反之，就说明没有选中任何父类
			if (this.catPid && this.catPid.length > 0) {
				// 为当前分类的等级赋值
				this.categoryForm.cat_level = this.catPid.length;
				// 父级分类的id
				this.categoryForm.cat_pid = this.catPid[this.catPid.length - 1];
			} else {
				// 为当前分类的等级赋值
				this.categoryForm.cat_level = 0;
				// 父级分类的id
				this.categoryForm.cat_pid = 0;
			}
		},
		// 监听对话框的关闭事件
		handleCategoryDialogClosed() {
			this.$refs.categoryFormRef.resetFields();
			this.categoryForm.cat_pid = 0;
			this.categoryForm.cat_level = 0;
			this.categoryForm.cat_name = "";
			delete this.categoryForm.cat_id;
			this.catPid = [];
		},
		// 点击按钮，添加或修改分类
		addOrUpdateCategory() {
			this.$refs.categoryFormRef.validate(async valid => {
				if (!valid) return;
				const { data: res } = !this.categoryForm.cat_id
					? await this.$http.post("categories", this.categoryForm)
					: await this.$http.put("categories/" + this.categoryForm.cat_id, {
							cat_name: this.categoryForm.cat_name
					  });
				if ((!this.categoryForm.cat_id && res.meta.status !== 201) || (!!this.categoryForm.cat_id && res.meta.status !== 200))
					return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				this.categoryDialogVisible = false;
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
