var mongoose = require('mongoose')
var ProductSchema = require('../schemas/products');
var Product = mongoose.model('product', ProductSchema);

module.exports = Product;