<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon> </el-alert>
			<!-- 选择商品分类区域 -->
			<el-row class="cat_op">
				<el-col>
					<span>选择商品分类:</span>
					<!-- 选择商品分类的级联选择框 -->
					<el-cascader
						placeholder="请选择"
						v-model="catPid"
						:options="opCategoryList"
						:props="props"
						@change="handleChange"
						clearable
					></el-cascader>
				</el-col>
			</el-row>
			<!-- tab页签区域 -->
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<!-- 添加动态参数的面板 -->
				<el-tab-pane label="动态参数" name="many">
					<!-- 添加参数的按钮 -->
					<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addAttr">添加参数</el-button>
					<!-- 动态参数表格 -->
					<el-table border stripe :data="manyAttrList">
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<!-- 循环渲染tag标签 -->
								<el-tag
									class="R"
									v-for="(item, index) in scope.row.attr_vals"
									:key="index"
									closable
									@close="handleClose(index, scope.row)"
								>
									{{ item }}
								</el-tag>
								<!-- 输入的文本框 -->
								<el-input
									class="input-new-tag R"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<!-- 添加按钮 -->
								<el-button v-else class="button-new-tag R" size="small" @click="showInput(scope.row)"
									>+ New Tag</el-button
								>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"> </el-table-column>
						<el-table-column prop="attr_name" label="参数名称"> </el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttr(scope.row)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr(scope.row)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 添加静态属性的面板 -->
				<el-tab-pane label="静态属性" name="only">
					<!-- 添加属性的按钮 -->
					<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addAttr">添加属性</el-button>
					<!-- 静态属性表格 -->
					<el-table border stripe :data="onlyAttrList">
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag
									class="R"
									v-for="(item, index) in scope.row.attr_vals"
									:key="index"
									closable
									@close="handleClose(index, scope.row)"
								>
									{{ item }}
								</el-tag>
								<el-input
									class="input-new-tag R"
									v-if="scope.row.inputVisible"
									v-model="scope.row.inputValue"
									ref="saveTagInput"
									size="small"
									@keyup.enter.native="handleInputConfirm(scope.row)"
									@blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<el-button v-else class="button-new-tag R" size="small" @click="showInput(scope.row)"
									>+ New Tag</el-button
								>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"> </el-table-column>
						<el-table-column prop="attr_name" label="属性名称"> </el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="editAttr(scope.row)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr(scope.row)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
		<parameter-dialog v-if="parameterVisible" ref="parameterRef" @refresh="getAttributeList"></parameter-dialog>
	</div>
</template>

<script>
import parameterDialog from "./components/parameterDialog.vue";
export default {
	components: {
		parameterDialog
	},
	data() {
		return {
			// 商品分类列表
			opCategoryList: [],
			// 级联选择框的配置对象
			props: {
				label: "cat_name",
				children: "children",
				value: "cat_id",
				// hover 触发子菜单
				expandTrigger: "hover",
				// 选择任意一级选项
				checkStrictly: true
			},
			// 级联选择框双向绑定到的数组
			catPid: [],
			// 被激活的页签的名称
			activeName: "many",
			// 动态参数的数据
			manyAttrList: [],
			// 静态属性的数据
			onlyAttrList: [],
			parameterVisible: false
		};
	},
	created() {
		// 获取所有的商品分类列表
		this.getThreeCategoryList();
	},
	methods: {
		// 获取所有的商品分类列表
		async getThreeCategoryList() {
			const params = {
				type: 3
			};
			const { data: res } = await this.$http.get("categories", { params });
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.opCategoryList = res.data;
		},
		// 级联选择框选择项变化，会触发这个函数
		handleChange() {
			this.getAttributeList();
		},
		// tab页签点击事件的处理函数
		handleClick() {
			this.getAttributeList();
		},
		// 获取参数列表
		async getAttributeList() {
			// 证明选中的不是三级分类
			if (this.catPid.length !== 3) {
				this.catPid = [];
				this.manyAttrList = [];
				this.onlyAttrList = [];
			} else {
				// 证明选中的是三级分类
				// 根据所选分类的id，和当前所处的面板，获取对应的参数
				const { data: res } = await this.$http.get(`categories/${this.catId}/attributes`, {
					params: {
						sel: this.activeName
					}
				});
				if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
				this.$message.success(res.meta.msg);
				res.data.forEach(item => {
					item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
					// 控制按钮与文本框的切换显示
					item.inputVisible = false;
					// 文本框中输入的内容
					item.inputValue = "";
				});
				if (this.activeName === "many") this.manyAttrList = res.data;
				else this.onlyAttrList = res.data;
			}
		},
		addAttr() {
			this.parameterVisible = true;
			this.$nextTick(() => {
				this.$refs.parameterRef.attrDialogVisible = true;
				this.$refs.parameterRef.init(this.activeName, this.catId);
			});
		},
		// 点击按钮，展示修改的对话框
		async editAttr(attr) {
			// 查询当前参数的信息
			const { data: res } = await this.$http.get(`categories/${this.catId}/attributes/${attr.attr_id}`, {
				params: {
					attr_sel: this.activeName
				}
			});
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.parameterVisible = true;
			this.$nextTick(() => {
				this.$refs.parameterRef.attrDialogVisible = true;
				this.$refs.parameterRef.init(this.activeName, this.catId, res.data);
			});
		},
		// 根据id删除对应的参数项
		async removeAttr(attr) {
			const confirmResult = await this.$confirm("此操作将永久删除参数/属性, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).catch(err => err);
			// 用户取消了删除
			if (confirmResult !== "confirm") return this.$message.info("已取消删除");
			// 删除的业务逻辑
			const { data: res } = await this.$http.delete(`categories/${this.catId}/attributes/${attr.attr_id}`);
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.getAttributeList();
		},
		// 点击按钮，展示文本输入框
		showInput(attr) {
			attr.inputVisible = true;
			// 让文本框自动获得焦点
			// $nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		// 文本框失去焦点，或摁下了Enter都会触发
		handleInputConfirm(attr) {
			const inputValue = attr.inputValue;
			if (inputValue.trim().length === 0) {
				attr.inputVisible = false;
				attr.inputValue = "";
				return;
			}
			// 如果没有return，则证明输入的内容，需要做后续处理
			if (inputValue) {
				const oldAttr = Object.assign({}, attr);
				attr.attr_vals.push(inputValue.trim());
				// 需要发送请求，保存这次操作
				this.saveAttr(attr, oldAttr);
			}
			attr.inputVisible = false;
			attr.inputValue = "";
		},
		/**
		 * type 为判断是删除还是修改
		 * 将对attr操作，保存到数据库
		 */
		async saveAttr(attr, oldAttr) {
			// 需要发送请求，保存这次操作
			const { data: res } = await this.$http.put(`categories/${this.catId}/attributes/${attr.attr_id}`, {
				attr_name: attr.attr_name,
				attr_sel: attr.attr_sel,
				attr_vals: attr.attr_vals.join(" ")
			});
			if (res.meta.status !== 200) {
				attr = Object.assign({}, oldAttr);
				return this.$message.error(res.meta.msg);
			}
			this.$message.success(res.meta.msg);
		},
		// 删除对应的参数可选项
		handleClose(i, attr) {
			const oldAttr = Object.assign({}, attr);
			attr.attr_vals.splice(i, 1);
			this.saveAttr(attr, oldAttr);
		}
	},
	computed: {
		// 如果按钮需要被禁用，则返回true，否则返回false
		isBtnDisabled() {
			if (this.catPid.length !== 3) return true;
			else return false;
		},
		// 当前选中的三级分类的id
		catId() {
			if (this.catPid.length === 3) return this.catPid[this.catPid.length - 1];
			return null;
		}
	}
};
</script>

<style lang="less" scoped>
.cat_op {
	margin-top: 15px;
}
.el-tabs {
	margin-top: 15px;
}
.R {
	margin: 10px;
	width: 200px;
}
.el-tag {
	width: unset !important;
}
</style>
