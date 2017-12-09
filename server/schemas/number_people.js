/**
 * 定义结构
 */

var mongoose = require('mongoose');
var Number_peopleSchema = new mongoose.Schema({
    //推荐码
    numberPeople: {
        unique: false,
        type: Number,
        default: 80
    }
});

module.exports = Number_peopleSchema;