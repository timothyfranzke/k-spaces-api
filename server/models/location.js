let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Address   = require('./address').schema;
let Avatar   = require('./avatar').schema;
let DaysOfWeek   = require('./daysOfWeek').schema;
let Hours   = require('./hours').schema;


module.exports = mongoose.model('Location', new Schema({
  name  : String,
  avatar  : Avatar,
  address : Address,
  days_of_week  : DaysOfWeek,
  hours : Hours,
  is_active: {type: Boolean, default: true}
}));
