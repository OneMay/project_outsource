var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    productName: String,
    productDescription: String,
    productImageUrl: String,
    ProductIntegration: {
        type: Number,
        default: 0
    },
    productInventory: {
        type: Number,
        default: 0
    }
})
module.exports = ProductSchema;