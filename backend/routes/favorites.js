const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user.favorites || []);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { movieId, movieData } = req.body;
    
    if (!user.favorites) {
      user.favorites = [];
    }
    
    user.favorites.push({ movieId, movieData });
    await user.save();
    
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:movieId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    const movieIdToDelete = req.params.movieId.toString();
    user.favorites = user.favorites.filter(fav => fav.movieId.toString() !== movieIdToDelete);
    
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
