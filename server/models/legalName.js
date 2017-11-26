let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('LegalName', new Schema({
  first: String,
  middle: String,
  last: String
}));
