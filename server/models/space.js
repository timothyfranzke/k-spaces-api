let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Avatar   = require('./avatar').schema;

module.exports = mongoose.model('Space', new Schema({
  name  : String,
  avatar  : Avatar,
  required_number_of_faculty  : Number,
  max_number_of_students  : Number,
  is_active: {type: Boolean, default: true}
}));
