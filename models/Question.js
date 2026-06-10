
const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
  
  text: {
    type: String,     
    required: true
  },
  
  topic: {
  type: String,
  required: true
},
  
  options: [{
    type: String      
  }],
  
  correctAnswer: {
    type: String,     
    required: true
  },
  
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'] 
  }
  

});


const Question = mongoose.model('Question', questionSchema);


module.exports = Question;