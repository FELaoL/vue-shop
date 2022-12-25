module.exports = function (db, callback) {
	// 用户模型
	db.define(
		"ConsigneeModel",
		{
			cgn_id: { type: "serial", key: true },
			user_id: Number,
			cgn_name: String,
			cgn_address: String,
			cgn_tel: String,
			cgn_code: String,
			delete_time: Number,
			order_id: Number,
			cgn_pcc: String
		},
		{
			table: "sp_consignee"
		}
	);
	return callback();
};
