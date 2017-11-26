let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Requester   = require('./requester').schema;

module.exports = mongoose.model('Request', new Schema({
  notes  : String,
  from  : Requester,
  to    : Requester,
  is_active: {type: Boolean, default: true}
}));
