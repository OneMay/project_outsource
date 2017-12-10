var mongoose = require('mongoose')
var OrderListSchema = require('../schemas/order');
var Order = mongoose.model('Order', OrderListSchema);

module.exports = Order;