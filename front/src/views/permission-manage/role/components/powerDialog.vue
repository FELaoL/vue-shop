<template>
	<!-- 分配权限的对话框 -->
	<el-dialog :title="allotRightDialogTitle" :visible.sync="allotRightDialogVisible" width="50%" @close="handleAllotRightDialogClose">
		<!-- 树形控件 -->
		<el-tree
			:data="rightList"
			:props="rightProps"
			show-checkbox
			default-expand-all
			node-key="id"
			:default-checked-keys="defaultRightChecked"
			ref="treeRef"
		></el-tree>
		<span slot="footer" class="dialog-footer">
			<el-button @click="allotRightDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="allotRight">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			// 分配权限
			allotRightDialogTitle: "分配权限",
			// 控制分配权限对话框的显示和隐藏
			allotRightDialogVisible: false,
			// 所有权限的数据
			rightList: [],
			// 树形控件的属性绑定对象
			rightProps: {
				children: "children",
				label: "authName"
			},
			// 默认选中的节点id数组
			defaultRightChecked: [],
			// 当前即将分配权限的角色id
			roleId: ""
		};
	},
	methods: {
		async init(role) {
			this.roleId = role.id;
			// 获取所有权限的数据
			const { data: res } = await this.$http.get("rights/tree");
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			// 把获取到的权限数据保存到data中
			this.$message.success(res.meta.msg);
			// 递归获取三级节点的id
			this.getAllCheckRight(role, this.defaultRightChecked);
			this.rightList = res.data;
			this.allotRightDialogVisible = true;
		},
		// 通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
		getAllCheckRight(rightArrNode, arr) {
			// 如果当前node节点不包含children属性，则是三级节点
			if (!rightArrNode.children) return arr.push(rightArrNode.id);
			rightArrNode.children.forEach(element => {
				this.getAllCheckRight(element, arr);
			});
		},
		// 监听分配权限对话框的关闭事件
		handleAllotRightDialogClose() {
			this.roleId = "";
			this.defaultRightChecked = [];
		},
		// 点击未角色分配权限
		async allotRight() {
			const checkedRightId = [...this.$refs.treeRef.getHalfCheckedKeys(), ...this.$refs.treeRef.getCheckedKeys()];
			const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
				rids: checkedRightId.join(",")
			});
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
			this.$message.success(res.meta.msg);
			this.allotRightDialogVisible = false;
			this.$emit("refresh");
		}
	}
};
</script>
