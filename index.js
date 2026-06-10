
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 


const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const scoreRoutes = require('./routes/scores'); 


const app = express();
const PORT = 5000;
const mongoUri = process.env.MONGO_URI;


app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/scores', scoreRoutes); 

async function startServer() {
  try {
    await mongoose.connect(mongoUri, {
      dbName: 'superQuiz'
    });
    console.log('Підключено до MongoDB (Mongoose)!');

    app.listen(PORT, () => {
      console.log(`Сервер запущено на порту ${PORT}`);
    });

  } catch (error) {
    console.error('Помилка підключення до MongoDB:', error);
    process.exit(1);
  }
}


app.get('/', (req, res) => {
  res.send('Вітаю! Ваш API-сервер працює і підключений до бази через Mongoose!');
});

startServer();