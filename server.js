const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
const ownerRoutes = require('./routes/ownerRoutes');
const carRoutes = require('./routes/carRoutes');
const renterRoutes = require('./routes/renterRoutes');
const favoriRoutes = require('./routes/favoriRoutes');
const regleRoutes = require('./routes/regleRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const dateautoRoutes = require('./routes/dateautoRoutes');
const paiementRoutes = require('./routes/paiementRoutes');

dotenv.config();
app.use((req, res, next) => {
    console.log(`🌍 Nouvelle requête : ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://armadapwa.vercel.app' ,'https://armada-back.onrender.com'   ]
}));


 

// Utilisation des routes
app.use('/owners', ownerRoutes);
app.use('/cars', carRoutes);
app.use('/renters', renterRoutes);
app.use('/regles', regleRoutes);
app.use('/favoris', favoriRoutes);
app.use('/services', serviceRoutes);
app.use('/ratings', ratingRoutes);
app.use('/reservations', reservationRoutes);
app.use('/dateautos', dateautoRoutes);
app.use('/paiements', paiementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
 