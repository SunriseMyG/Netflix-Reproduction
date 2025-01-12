const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const favoritesRoutes = require('./routes/favorites');
app.use('/api/favorites', favoritesRoutes);

app.get('/', (req, res) => {
    res.send("Hello from the backend!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
