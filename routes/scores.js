
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const Score = require('../models/Score');


router.post('/', authMiddleware, async (req, res) => {
  try {
    
    const { score, totalQuestions, timeTaken } = req.body;
    const userId = req.user.userId;

    
    const existingScore = await Score.findOne({ user: userId });

    
    if (!existingScore) {
      const newScore = new Score({
        score,
        totalQuestions,
        timeTaken,
        user: userId
      });
      await newScore.save();
      return res.status(201).json({ message: 'Результат успішно збережено!' });
    }

    
    if (score > existingScore.score) {
      existingScore.score = score;
      existingScore.totalQuestions = totalQuestions;
      existingScore.timeTaken = timeTaken;
      await existingScore.save();
      return res.status(200).json({ message: 'Новий рекорд! Результат оновлено.' });
    }

    
    if (score === existingScore.score && timeTaken < existingScore.timeTaken) {
      existingScore.timeTaken = timeTaken;
      await existingScore.save();
      return res.status(200).json({ message: 'Той самий результат, але швидше! Оновлено.' });
    }

   
    res.status(200).json({ message: 'Ваш попередній результат кращий. Не оновлено.' });

  } catch (error) {
    console.error('Помилка збереження балів:', error);
    
    if (error.code === 11000) {
       return res.status(400).json({ message: 'Помилка унікальності. Можливо, запис вже існує.'});
    }
    res.status(500).json({ message: 'Щось пішло не так' });
  }
});


router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Score.find({})
      .sort({ score: -1, timeTaken: 1 }) 
      .limit(10)
      .populate('user', 'username');

    res.json(leaderboard);

  } catch (error) {
    console.error('Помилка отримання лідерборду:', error);
    res.status(500).json({ message: 'Щось пішло не так' });
  }
});


module.exports = router;