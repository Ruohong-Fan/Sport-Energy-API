var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var sportLeaderAccountSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the sport leader'
  },
  profile: {
    type: String
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  tel: {
	  type: String
  },
  tag: {
    sport: [{
      type: String,
      enum: ['all', 'skiing', 'yoga', 'fishing'],
      default: ['all']
    }]
  }
});

module.exports = mongoose.model('sportLeaderAccount', sportLeaderAccountSchema);
