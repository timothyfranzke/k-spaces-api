let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Avatar', new Schema({
  thumb: String,
  full  : String
}));
