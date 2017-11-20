let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Hours', new Schema({
  start_time: Date,
  end_time: Date
}));
