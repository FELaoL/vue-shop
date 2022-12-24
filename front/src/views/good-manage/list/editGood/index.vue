<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/goods' }">商品列表</el-breadcrumb-item>
			<el-breadcrumb-item>{{ menu }}</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 提示区域 -->
			<el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
			<!-- 步骤条区域 -->
			<el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
				<el-step title="基本信息"></el-step>
				<el-step title="商品参数"></el-step>
				<el-step title="商品属性"></el-step>
				<el-step title="商品图片"></el-step>
				<el-step title="商品内容"></el-step>
				<el-step title="完成"></el-step>
			</el-steps>
			<!-- tab栏区域 -->
			<el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="100px" label-position="top">
				<el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClicked">
					<el-tab-pane label="基本信息" name="0">
						<el-form-item label="商品名称" prop="goods_name">
							<el-input v-model="addGoodForm.goods_name"></el-input>
						</el-form-item>
						<el-form-item label="商品价格" prop="goods_price">
							<el-input v-model="addGoodForm.goods_price" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品重量" prop="goods_weight">
							<el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品数量" prop="goods_number">
							<el-input v-model="addGoodForm.goods_number" type="number"></el-input>
						</el-form-item>
						<el-form-item label="商品分类" prop="goods_cat">
							<el-cascader
								placeholder="请选择"
								v-model="addGoodForm.goods_cat"
								:options="categoryList"
								:props="props"
								@change="handleChange"
								clearable
							></el-cascader>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品参数" name="1">
						<!-- 渲染表单的item项 -->
						<el-form-item :label="item.attr_name" v-for="item in manyAttrList" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox
									:label="item1"
									v-for="(item1, index1) in item.attr_vals"
									:key="index1"
									border
								></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品属性" name="2">
						<el-form-item :label="item.attr_name" v-for="item in onlyAttrList" :key="item.attr_id">
							<el-checkbox-group v-model="item.attr_vals">
								<el-checkbox
									:label="item1"
									v-for="(item1, index1) in item.attr_vals"
									:key="index1"
									border
								></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品图片" name="3">
						<!-- action 表示图片要上传到的后台API地址 -->
						<el-upload
							:action="uploadUrl"
							:headers="headers"
							:on-success="onUploadSuccess"
							:on-preview="handlePreview"
							:on-remove="handleRemove"
							:file-list="fileList"
							list-type="picture"
						>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</el-tab-pane>
					<el-tab-pane label="商品内容" name="4">
						<!-- 富文本编辑器组件 -->
						<quill-editor class="vue-quill-editor" v-model="addGoodForm.goods_introduce" />
						<el-button type="primary" class="addGoodsBtn" @click="addGood">{{ menu }}</el-button>
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-card>
		<pic-preview-dialog v-if="picPreviewVisible" ref="picPreviewRef"></pic-preview-dialog>
	</div>
</template>

<script>
import _ from "lodash";
import picPreviewDialog from "../components/picPreviewDialog.vue";
export default {
	components: {
		picPreviewDialog
	},
	data() {
		return {
			activeIndex: "0",
			// 添加商品的表单数据对象
			addGoodForm: {
				goods_name: "",
				goods_price: 0,
				goods_weight: 0,
				goods_number: 0,
				// 商品所属的分类数组
				goods_cat: [],
				// 图片的数组
				pics: [],
				// 商品的详情描述
				goods_introduce: "",
				attrs: []
			},
			addGoodFormRules: {
				goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
				goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
				goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
				goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
				goods_cat: [{ required: true, message: "请选择商品分类", trigger: "blur" }]
			},
			// 商品分类列表
			categoryList: [],
			props: {
				label: "cat_name",
				children: "children",
				value: "cat_id",
				// hover 触发子菜单
				expandTrigger: "hover",
				// 选择任意一级选项
				checkStrictly: true
			},
			// 动态参数列表数据
			manyAttrList: [],
			// 静态属性列表数据
			onlyAttrList: [],
			// 上传图片的url地址
			uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
			// 图片上传罪案的headers请求头对象
			headers: {
				Authorization: window.sessionStorage.getItem("token")
			},
			picPreviewVisible: false,
			// 下方是修改时单独用到的数据
			isChangeCategory: false,
			fileList: [],
			menu: "添加商品"
		};
	},
	methods: {
		// 获取所有商品分类数据
		async getCategoryList() {
			const { data: res } = await this.$http.get("categories");
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.categoryList = res.data;
		},
		// 级联选择器选中项变化，会触发这个函数
		handleChange() {
			this.isChangeCategory = true;
			if (this.addGoodForm.goods_cat.length !== 3) this.addGoodForm.goods_cat = [];
		},
		beforeLeave(activeName, oldActiveName) {
			if (oldActiveName === "0" && !this.catId) {
				this.$message.error("请先选择商品分类");
				return false;
			}
			// 不是编辑或者不是改变类目
			if ((!this.addGoodForm.goods_id || this.isChangeCategory) && (activeName === "1" || activeName === "2"))
				this.getAttrList(activeName);
		},
		tabClicked() {
			// this.getAttrList(this.activeName)
		},
		async getAttrList(activeName) {
			const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, {
				params: {
					// 1证明访问的是动态参数面板
					// 2证明访问的是静态属性面板
					sel: activeName === "1" ? "many" : "only"
				}
			});
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			res.data.forEach(item => {
				item.attr_vals = item.attr_vals.length > 0 ? item.attr_vals.split(" ") : [];
			});
			if (activeName === "1") this.manyAttrList = res.data;
			else this.onlyAttrList = res.data;
		},
		// 监听图片上传成功
		onUploadSuccess(res) {
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			// 1.拼接得到一个图片信息对象
			const pic = { pic: res.data.tmp_path };
			// 2.将图片信息对象push到pics数组中
			this.addGoodForm.pics.push(pic);
		},
		// 处理移除图片的操作
		handleRemove(file) {
			// 1.获取将要删除的图片的临时路径
			const filePath = (file.response && file.response.data && file.response.data.tmp_path) || file.url;
			// 2.从pics数组中，找到这个图片对应的索引值
			const index = this.addGoodForm.pics.findIndex(item => item.pic === filePath || item.pics_big_url === filePath);
			// 调用数组的splice方法，把图片信息对象，从pics数组中移除
			this.addGoodForm.pics.splice(index, 1);
		},
		// 处理图片预览效果
		handlePreview(file) {
			this.picPreviewVisible = true;
			this.$nextTick(() => {
				this.$refs.picPreviewRef.dialogVisible = true;
				this.$refs.picPreviewRef.init((file.response && file.response.data && file.response.data.url) || file.url);
			});
		},
		// 添加商品
		addGood() {
			this.$refs.addGoodFormRef.validate(async valid => {
				if (!valid) return this.$message.error("请填写完整必要的表单项！");
				// 执行添加的业务逻辑
				// lodash cloneDeep(obj)
				const form = _.cloneDeep(this.addGoodForm);
				form.goods_cat = form.goods_cat.join(",");
				form.attrs = [];
				// 处理动态参数
				this.manyAttrList.forEach(item => {
					const attr = {
						attr_id: item.attr_id,
						attr_value: item.attr_vals.length > 0 ? item.attr_vals.join(" ") : ""
					};
					form.attrs.push(attr);
				});
				// 处理静态属性
				this.onlyAttrList.forEach(item => {
					const attr = {
						attr_id: item.attr_id,
						attr_value: item.attr_vals.length > 0 ? item.attr_vals.join(" ") : ""
					};
					form.attrs.push(attr);
				});
				// 发起请求，添加商品
				// 商品名称，必须是唯一的
				const { data: res } = !this.addGoodForm.goods_id
					? await this.$http.post("goods", form)
					: await this.$http.put(`goods/${this.addGoodForm.goods_id}`, form);

				if (
					(!this.addGoodForm.goods_id && res.meta.status !== 201) ||
					(!!this.addGoodForm.goods_id && res.meta.status !== 200)
				)
					return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				this.$router.push("/goods");
			});
		},
		// 获取商品的信息
		async getGoodInfo(goodId) {
			const { data: res } = await this.$http.get(`goods/${goodId}`);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			res.data.goods_cat = res.data.goods_cat.split(",");
			const goodsCat = [];
			res.data.goods_cat.forEach(item => {
				goodsCat.push(parseInt(item));
			});
			res.data.goods_cat = goodsCat;
			// 参数和属性的处理
			res.data.attrs.forEach(item => {
				item.attr_vals = item.attr_value ? item.attr_value.split(" ") : [];
				if (item.attr_sel === "many") this.manyAttrList.push(item);
				else this.onlyAttrList.push(item);
			});
			// 图片的处理
			res.data.pics.forEach(item => {
				const arr = item.pics_big_url.split("/");
				const picList = {
					name: arr[arr.length - 1],
					url: item.pics_big_url
				};
				this.fileList.push(picList);
			});
			this.addGoodForm = res.data;
		},
		resetData() {
			this.isChangeCategory = false;
			this.manyAttrList = [];
			this.onlyAttrList = [];
		}
	},
	created() {
		this.resetData();
		this.getCategoryList();
		const goodId = this.$route.query.goodId;
		if (goodId) {
			this.menu = "修改商品";
			this.getGoodInfo(goodId);
		} else {
			this.menu = "添加商品";
		}
	},
	computed: {
		catId() {
			if (this.addGoodForm.goods_cat.length === 3) return this.addGoodForm.goods_cat[2];
			return null;
		}
	}
};
</script>

<style lang="less" scoped>
.el-checkbox {
	margin: 0 10px 0 0;
}

.addGoodsBtn {
	margin-top: 15px;
}
</style>
