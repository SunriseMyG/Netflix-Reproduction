const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'HAIOSDIJHZJAOSIUDH';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ message: 'Authentification requise' });
  }
};

