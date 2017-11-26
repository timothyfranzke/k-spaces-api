let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Address   = require('./address').schema;
let Avatar   = require('./avatar').schema;
let LegalName = require('./legalName').schema;
let ContactInfo = require('./contactInfo').schema;

module.exports = mongoose.model('UserDetail', new Schema({
  _id : String,
  legal_name  : LegalName,
  avatar  : Avatar,
  address : Address,
  contact_info :ContactInfo,
  gender  : String,
  birthday : Date,
  is_active: {type: Boolean, default: true}
}));
