var mongoose = require('mongoose');
var number_peopleSchema = require('../schemas/number_people');
var number_people = mongoose.model('number_people', number_peopleSchema); //编译生成

module.exports = number_people;