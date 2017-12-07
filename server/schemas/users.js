var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//模式定义
var UserSchema = new Schema({
    username: String,
    goods: [{ type: ObjectId, ref: 'Goods' }],
    password: String,
    phoneNumber: {
        type: String,
        unique: true
    },
    bankNumber: String,
    invitation_code_from_people: {
        type: String,
        default: null
    },
    invitation_code: {
        type: String,
        unique: true,
        default: null
    },
    power: {
        type: Number,
        default: 3
    },
    invitation_people: {
        type: Number,
        default: 0
    },
    invitated_people: {
        type: Number,
        default: 0
    }
})


//只有经过module编译，实例化后才会有这个方法
UserSchema.statics = {
    fetch: function(cb) { //取出数据库目前所有数据
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) { //查询单条数据数据
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}

module.exports = UserSchema;