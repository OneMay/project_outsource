var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var LoanListSchema = new Schema({
    _userId: String, //用户ID
    name: String, //贷款类型
    money: {
        type: Number,
        default: 0
    },
    success: { //审核
        type: Boolean,
        default: false
    },
    fail: { //失败
        type: Boolean,
        default: false
    },
    grant: {
        type: Boolean,
        default: false
    },
    time: Date
})
module.exports = LoanListSchema;