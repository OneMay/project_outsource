var mongoose = require('mongoose'); //提现
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var WithdrawalsListSchema = new Schema({
    _userId: String, //用户ID
    money: {
        type: Number,
        default: 0
    },
    success: { //还在处理
        type: Boolean,
        default: false
    },
    time: Date
})
module.exports = WithdrawalsListSchema;