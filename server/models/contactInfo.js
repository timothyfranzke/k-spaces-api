/**
 * Created by timothyfranzke on 11/22/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('ContactInfo', new Schema({
  home_phone: String,
  cell_phone: String,
  work_phone: String,
  email_primary: String,
  email_secondary: String
}));
