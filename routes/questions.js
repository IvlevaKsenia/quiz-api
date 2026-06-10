const express = require('express');
const router = express.Router();
const Question = require('../models/Question');


router.get('/random', async (req, res) => {
  try {
    const { difficulty, topic } = req.query;
    console.log(`Запит на рандомні питання. Фільтри: topic=${topic}, difficulty=${difficulty}`);

    
    const pipeline = [];

    
    if (difficulty || topic) {
      const match = {};
      if (difficulty) match.difficulty = difficulty;
      if (topic) match.topic = topic;
      pipeline.push({ $match: match });
    }


    pipeline.push({ $sample: { size: 10 } });

    const questions = await Question.aggregate(pipeline);

    console.log(`Знайдено та відправлено питань: ${questions.length}`);
    res.json(questions);

  } catch (error) {
    console.error('Помилка рандому:', error);
    res.status(500).json({ message: 'Помилка при вибірці випадкових питань' });
  }
});


router.get('/topics', async (req, res) => {
  try {
    const topics = await Question.distinct('topic');
    res.json(topics); 
  } catch (error) {
    console.error('Помилка при отриманні тем:', error);
    res.status(500).json({ message: 'Щось пішло не так' });
  }
});


router.get('/', async (req, res) => {
  try {
    const { difficulty, topic } = req.query; 

    let filter = {}; 
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = topic;

    
    const questions = await Question.find(filter);
    res.json(questions);

  } catch (error) {
    console.error('Помилка при отриманні питань:', error);
    res.status(500).json({ message: 'Щось пішло не так' });
  }
});



module.exports = router;