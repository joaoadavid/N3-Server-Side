const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Bike = require('../models/bicicleta'); 
const Quadro = require('../models/quadro');
const withAuth = require ('../middlewares/auth');
const bicicleta = require('../models/bicicleta');

// Criar Bicicleta
router.post('/bikes', withAuth, async (req, res) => {
    const { marca_bicicleta, cor_bicicleta, quadroId, usuarioId } = req.body;

    try {
        const quadro = await Quadro.findById(quadroId);
        const usuario = await User.findById(usuarioId);

        if (!quadro || !usuario) {
            return res.status(404).json({ error: 'Quadro ou usuário não encontrado' });
        }

        const bike = new Bike({
            marca_bicicleta,
            cor_bicicleta,
            quadro,
            usuario,
        });

        await bike.save();

        const response = {
            codigo_bicicleta: bike._id, // Usando o _id gerado pelo MongoDB
            marca_bicicleta: bike.marca_bicicleta,
            cor_bicicleta: bike.cor_bicicleta,
            quadro: bike.quadro.tamanho_quadro,
            usuario: bike.usuario.nome,
        };

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar bicicleta' });
    }
});

// Obter todas as bicicletas
router.get('/bikes', async (req, res) => {
  try {
    const bikes = await Bike.find().populate('quadro', 'tamanho_quadro').populate('usuario', 'nome codigo_bicicleta');

    const formattedBikes = bikes.map((bike) => {
      return {
        codigo_bicicleta: bike._id,  // Inclua esta linha para obter o ID
        marca_bicicleta: bike.marca_bicicleta,
        cor_bicicleta: bike.cor_bicicleta,
        quadro: bike.quadro.tamanho_quadro,
        usuario: bike.usuario.nome,
      };
    });

    res.json(formattedBikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter bicicletas' });
  }
});


// Obter bicicletas por interessado
router.get('/bikes/usuario/:usuarioId', withAuth, async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const bikes = await Bike.find({ usuario: usuarioId }).populate('quadro').populate('usuario');

    if (bikes.length === 0) {
      return res.status(404).json({ error: 'Nenhuma bicicleta encontrada para este usuário' });
    }

    // Verifica se o usuário é dono de pelo menos uma bicicleta
    const isOwnerOfAnyBike = bikes.some(bike => isOwner(req.user, bike));

    if (isOwnerOfAnyBike) {
      // Mapeia e formata os resultados
      const formattedBikes = bikes.map((bike) => ({
        codigo_bicicleta: bike._id,
        marca_bicicleta: bike.marca_bicicleta,
        cor_bicicleta: bike.cor_bicicleta,
        quadro: bike.quadro.tamanho_quadro,
        usuario: bike.usuario.nome,
      }));

      res.json(formattedBikes);
    } else {
      res.status(403).json({ error: 'Nenhuma bicicleta pertence a este usuário' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter bicicletas por usuário' });
  }
});

// Obter bicicletas por Quadro
router.get('/bikes/quadro/:quadroId', async (req, res) => {
  const { quadroId } = req.params;

  try {
    const bikes = await Bike.find({ quadro: quadroId }).populate('quadro').populate('usuario');

    if (bikes.length === 0) {
      return res.status(404).json({ error: 'Nenhuma bicicleta encontrada para este quadro' });
    }

    // Mapeia e formata os resultados
    const formattedBikes = bikes.map((bike) => ({
      codigo_bicicleta: bike._id,
      marca_bicicleta: bike.marca_bicicleta,
      cor_bicicleta: bike.cor_bicicleta,
      quadro: bike.quadro.tamanho_quadro,
      usuario: bike.usuario.nome,
    }));

    res.json(formattedBikes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter bicicletas por quadro' });
  }
});


//Atualiza as informações da bicicleta
router.put('/bikes/:bikeId', withAuth, async (req, res) => {
  const { bikeId } = req.params;
  const { marca_bicicleta, cor_bicicleta } = req.body;

  try {
    const bike = await Bike.findById(bikeId).populate('quadro').populate('usuario');

    if (!bike) {
      return res.status(404).json({ error: 'Bicicleta não encontrada' });
    }

    // Verifica se o usuário é o dono da bicicleta
    if (!isOwner(req.user, bike)) {
      return res.status(403).json({ error: 'Você não tem permissão para atualizar esta bicicleta' });
    }

    // Atualiza os dados da bicicleta
    bike.marca_bicicleta = marca_bicicleta;
    bike.cor_bicicleta = cor_bicicleta;

    await bike.save();

    res.json(bike);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar bicicleta' });
  }
});


// Deletar bicicleta
router.delete('/bikes/:bikeId', withAuth, async (req, res) => {
  const { bikeId } = req.params;

  try {
    const bike = await Bike.findById(bikeId);
    await Bike.deleteOne({ _id: bikeId });
    if (isOwner(req.user, bike)) {
      res.status(204).json({ message: 'Bicicleta deletada com sucesso' });
    }else{
      return res.status(403).json({ error: 'Você não tem permissão para deletar esta bicicleta' });
    }

  } catch (error) {
    console.error('Erro ao deletar bicicleta:', error);
    res.status(500).json({ error: 'Erro ao deletar bicicleta' });
  }
});



const isOwner = (user, bike) => {
  console.log('User ID:', user._id);
  console.log('Bike User ID:', bike.usuario._id);

  if (JSON.stringify(user._id) === JSON.stringify(bike.usuario._id)) {
    console.log('User is owner');
    return true;
  }

  console.log('User is NOT owner');
  return false;
};



module.exports = router;
