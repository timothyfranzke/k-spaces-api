let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Address', new Schema({
  line_one  : String,
  line_two  : String,
  line_three : String,
  city  : String,
  state : String,
  zip: Number
}));
