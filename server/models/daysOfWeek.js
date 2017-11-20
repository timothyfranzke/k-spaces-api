let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('DaysOfWeek', new Schema({
  monday: {type: Boolean, default: true},
  tuesday: {type: Boolean, default: true},
  wednesday: {type: Boolean, default: true},
  thursday: {type: Boolean, default: true},
  friday: {type: Boolean, default: true},
  saturday: {type: Boolean, default: true},
  sunday: {type: Boolean, default: true}
}));
