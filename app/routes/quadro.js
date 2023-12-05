const express = require('express');
const router = express.Router();
const Quadro = require('../models/quadro');
const WithAuth = require('../middlewares/auth');
const withAuth = require ('../middlewares/auth')

// Criar quadro
router.post('/quadros', async (req, res) => {
  const { tamanho_quadro } = req.body;

  try {
    const quadro = new Quadro({ tamanho_quadro });
    await quadro.save();
    res.status(201).json(quadro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar quadro' });
  }
});

// Obter todos os quadros
router.get('/quadros', async (req, res) => {
  try {
    const quadros = await Quadro.find();
    res.json(quadros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter quadros' });
  }
});

// Obter quadro por ID
router.get('/quadros/:quadroId', async (req, res) => {
  const { quadroId } = req.params;

  try {
    const quadro = await Quadro.findById(quadroId);

    if (!quadro) {
      return res.status(404).json({ error: 'Quadro não encontrado' });
    }

    res.json(quadro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter quadro por ID' });
  }
});

// Atualizar quadro
router.put('/quadros/:quadroId',  async (req, res) => {
  const { quadroId } = req.params;
  const { tamanho_quadro } = req.body;

  try {
    const quadro = await Quadro.findByIdAndUpdate(
      quadroId,
      { tamanho_quadro },
      { new: true }
    );

    if (!quadro) {
      return res.status(404).json({ error: 'Quadro não encontrado' });
    }

    res.json(quadro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar quadro' });
  }
});

// Deletar quadro
router.delete('/quadros/:quadroId', async (req, res) => {
  const { quadroId } = req.params;

  try {
    const quadro = await Quadro.findByIdAndDelete(quadroId);

    if (!quadro) {
      return res.status(404).json({ error: 'Quadro não encontrado' });
    }

    res.json({ message: 'Quadro deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar quadro' });
  }
});

module.exports = router;
