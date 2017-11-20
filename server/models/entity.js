let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Address   = mongoose.model('Address').schema;


module.exports = mongoose.model('Location', new Schema({
  name  : String,
  avatar  : {type: 'Avatar'},
  address : {type: Address},
  days_of_week  : {type: 'DaysOfWeek'},
  hours : {type: 'Hours'},
  is_active: {type: Boolean, default: true},
  timestamp:true
}));
