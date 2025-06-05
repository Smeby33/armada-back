const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host:"srv1903.hstgr.io"  ,
    user: "u929681960_smeby",
    password:"DIKIdiki0832",
    database: "u929681960_armada",
    waitForConnections: true,
    connectionLimit: 50,  // Limite de connexions simultanées
    queueLimit: 0
});

// Vérification de la connexion
(async () => {
    try {
        const connection = await db.getConnection();
        console.log('✅ Connexion MySQL réussie votre base de donne=ées fonctionne !');
        connection.release(); // Libérer la connexion après vérification
    } catch (err) {
        console.error('❌ Erreur de connexion à la base de données:', err);
    }
})();

module.exports = db;
