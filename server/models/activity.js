let mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Activity', new Schema({
  type  : String,
  metrics :[
    {
      key: String,
      value: String
    }
  ],
  start_date: { type: Date, default: Date.now },
  end_date:{ type: Date, default: Date.now },
  is_active:{type:Boolean, default: true},
  notes: String
}));
