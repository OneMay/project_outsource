var mongoose = require('mongoose')
var LoanListSchema = require('../schemas/loan');
var Loan = mongoose.model('Loan', LoanListSchema);

module.exports = Loan;