let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Requester', new Schema({
  _id  : String,
  type  : String
}));
