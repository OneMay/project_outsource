var mongoose = require('mongoose');
var WithdrawalsSchema = require('../schemas/withdrawals');
var Withdrawals = mongoose.model('withdrawals', WithdrawalsSchema);

module.exports = Withdrawals;