var mongoose = require('mongoose');
var invitationCodeSchema = require('../schemas/invitationcode');
var invitationCode = mongoose.model('invitationcode', invitationCodeSchema); //编译生成

module.exports = invitationCode;