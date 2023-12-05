const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_TOKEN;
const withAuth = require ('../middlewares/auth')

/* GET users listing. */
router.post('/register', async (req, res) => {
  const { nome, email, password, telefone, altura } = req.body;
  const user = new User({ nome, email, password, telefone, altura });

  try {
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error registering new user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) res.status(401).json({ error: 'Incorrect email or password' });
    else {
      user.isCorrectPassword(password, function (err, same) {
        if (!same) res.status(401).json({ error: 'Incorrect email or password' });
        else {
          const token = jwt.sign({ email }, secret, { expiresIn: '10d' });
          res.json({ user: user, token: token });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal error, please try again' });
  }
});


// Obter todos os usuários
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting users' });
  }
});

// Obter usuário por ID
router.get('/users/:userId',withAuth, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting user by ID' });
  }
});

// Atualizar usuário
router.put('/users/:userId', withAuth, async (req, res) => {
  const { userId } = req.params;
  const { nome, email, password, telefone, altura } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { nome, email, password, telefone, altura },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Deletar usuário
router.delete('/users/:userId',withAuth, async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }

});


module.exports = router;
