
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 


const jwt = require('jsonwebtoken');


const User = require('../models/User');


router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Цей username вже зайнятий' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username: username,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: 'Користувача успішно створено!' });
  } catch (error) {
    console.error('Помилка реєстрації:', error);
    res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' });
  }
});



router.post('/login', async (req, res) => {
  try {
    
    const { username, password } = req.body;

    
    const user = await User.findOne({ username: username });
    if (!user) {
      
      return res.status(400).json({ message: 'Неправильний логін або пароль' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      
      return res.status(400).json({ message: 'Неправильний логін або пароль' });
    }

    
    const token = jwt.sign(
      { userId: user.id },      
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }      
    );

    
    res.json({ token: token, userId: user.id, message: "Ви успішно увійшли!" });

  } catch (error) {
    console.error('Помилка логіну:', error);
    res.status(500).json({ message: 'Щось пішло не так, спробуйте знову' });
  }
});



module.exports = router;