var mongoose = require('mongoose')
var MembersDemeanorSchema = require('../schemas/Members_demeanor');
var MembersDemeanor = mongoose.model('membersDemeanor', MembersDemeanorSchema);

module.exports = MembersDemeanor;