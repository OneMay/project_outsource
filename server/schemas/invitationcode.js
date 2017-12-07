/**
 * 定义结构
 */

var mongoose = require('mongoose');
var invitationCodeSchema = new mongoose.Schema({
    //推荐码
    invitation_code: {
        unique: true,
        type: String
    }
});

module.exports = invitationCodeSchema;