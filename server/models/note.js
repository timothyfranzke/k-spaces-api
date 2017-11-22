let mongoose = require('mongoose');
let Schema = mongoose.Schema;


module.exports = mongoose.model('Note', new Schema({
  name  : String,
  description  : String,
  color : String,
  time  : {type: Date, default: Date.now()},
  reminder : Date,
  checklist : [
    {
      checked: {type: Boolean, default: false},
      text : String
    }
  ],
  is_active: {type: Boolean, default: true}
}));
