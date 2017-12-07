/**
 * 创建模型
 */
var mongoose = require('mongoose');
var UserSchema = require('../schemas/adminusers');
var adminUser = mongoose.model('adminuser', UserSchema); //编译生成

module.exports = adminUser;