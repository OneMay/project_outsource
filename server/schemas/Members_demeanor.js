var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MembersDemeanorSchema = new Schema({
    title: String,
    content: String,
    membersDemeanoPhoto: [{
        type: String
    }]

})
module.exports = MembersDemeanorSchema;