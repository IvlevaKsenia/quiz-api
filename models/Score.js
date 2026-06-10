
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  
  timeTaken: { 
    type: Number,
    required: true
  },
  
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    unique: true 
                
  }
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);