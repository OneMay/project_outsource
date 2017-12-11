var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var OrderListSchema = new Schema({
    _mallId: String, //商品Id
    _userId: String, //用户ID
    inventory: Number, //数量,
    consignee: String, //收货人姓名,
    consigneePhone: String, //收货人电话,
    consigneeAddress: String, //邮寄地址
    integration: Number, //用户实际消耗的积分,
    money: {
        type: Number,
        default: 0
    },
    isExamine: { //审核
        type: Boolean,
        default: false
    },
    Deliver_goods: { //发货
        type: Boolean,
        default: false
    },
    mallName: String,
    time: Date
})
module.exports = OrderListSchema;