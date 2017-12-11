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
    invitation_code_from_people: { //邀请人的推荐码
        type: String,
        default: null
    },
    invitation_code: { //推荐码
        type: String,
        unique: true,
        default: null
    },
    power: { //获得团队奖次数
        type: Number,
        default: 0
    },
    isVip: { //高级会员
        type: Boolean,
        default: false
    },
    invitated_people: { //推荐的人数
        type: Number,
        default: 0
    },
    previnvitated_people: { //上一次结算推荐的人数
        type: Number,
        default: 0
    },
    straight: { //直接获利人数
        type: Number,
        default: 0
    },
    secondhand: { //间接获利人数
        type: Number,
        default: 0
    },
    member_mark: { //积分
        type: Number,
        default: 0
    },
    email: {
        type: String,
        unique: false,
        default: null
    },
    usedmoney: {
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