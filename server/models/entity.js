let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Address   = mongoose.model('Address').schema;
let Avatar   = mongoose.model('Avatar').schema;
let Hours   = mongoose.model('Hours').schema;
let DaysOfWeek   = mongoose.model('DaysOfWeek').schema;

module.exports = mongoose.model('Entity', new Schema({
  name  : String,
  avatar  : {type: Avatar},
  address : {type: Address},
  days_of_week  : {type: DaysOfWeek},
  hours : {type: Hours},
  is_active: {type: Boolean, default: true}
}));
