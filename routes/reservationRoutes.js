const express = require('express');
const db = require('../db');

const router = express.Router();

// 🔧 Fonction pour générer un ID unique pour les services
function generateReservationId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const numbers = Math.floor(100 + Math.random() * 900); // 3 chiffres
  return prefix + numbers;
}

// ➕ Ajouter une réservation
router.post('/reservation', async (req, res) => {
  const {
    conducteur,
    voiture,
    proprietaire,
    date_debut,
    date_fin,
    avance,
    caution,
    livraison,
    heuredeprise,
    heurederetour,
    totale,
    statut,
    latitude,
    longitude,
  } = req.body;

  const id = generateReservationId();
  console.log("🆔 [POST /reservation] id généré :", id);

  try {
    const sql = `
      INSERT INTO reservation (
        id, conducteur, voiture, proprietaire, date_debut, date_fin, avance, caution, livraison, heuredeprise, heurederetour, totale, statut,latitude, longitude
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      id, conducteur, voiture, proprietaire, date_debut, date_fin,
      avance, caution, livraison, heuredeprise, heurederetour, totale, statut,latitude, longitude
    ];

    await db.query(sql, values);
    res.json({ message: 'Réservation ajoutée avec succès.', id });
  } catch (err) {
    console.error('❌ Erreur SQL :', err);
    res.status(500).json({ error: 'Erreur lors de l’ajout de la réservation.' });
  }
});


// ✏️ Mettre à jour une réservation
router.put('/updateReservation/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "Aucun champ fourni pour la mise à jour." });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), id];

  try {
    const sql = `UPDATE reservation SET ${updates} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Réservation non trouvée." });
    }
    res.json({ message: "Réservation mise à jour avec succès." });
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});


// 🗑️ Supprimer une réservation
router.delete('/supprimer/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`📥 [DELETE /:id] Demande de suppression pour la réservation id : ${id}`);

  try {
    const [result] = await db.query('DELETE FROM reservation WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      console.log(`❌ [DELETE /:id] Réservation non trouvée pour id : ${id}`);
      return res.status(404).json({ error: "Réservation non trouvée." });
    }
    console.log(`✅ [DELETE /:id] Réservation supprimée avec succès, id : ${id}`);
    res.json({ message: "Réservation supprimée avec succès." });
  } catch (err) {
    console.error("❌ [DELETE /:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});


// 🔍 Récupérer une réservation par ID
router.get('/reservationvoiture/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM reservation WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération de la réservation." });
  }
});

// 🔍 Récupérer la dernière réservation pour une voiture et un conducteur
router.get('/last/:voiture/:conducteur', async (req, res) => {
  const { voiture, conducteur } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT * FROM reservation 
       WHERE voiture = ? AND conducteur = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [voiture, conducteur]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune réservation trouvée pour ce couple voiture/conducteur." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération de la réservation." });
  }
});


// 🔍 Récupérer toutes les réservations d'un conducteur
router.get('/conducteur/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM reservation WHERE conducteur = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune réservation trouvée pour ce conducteur." });
    }

    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des réservations." });
  }
});

// 🔍 Récupérer toutes les réservations d'un propriétaire
router.get('/reservations/proprietaire/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM reservation WHERE proprietaire = ?', [id]);
    console.log(`[GET /reservations/proprietaire/:id] Réservations récupérées pour le propriétaire ${id} :`, rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune réservation trouvée pour ce propriétaire." });
    }

    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /proprietaire/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des réservations." });
  }
});

// 🔍 Récupérer toutes les réservations
router.get('/recuperer/allReservation', async (req, res) => {
  console.log("📥 [GET /all] Demande de récupération de toutes les réservations");
  try {
    const [rows] = await db.query('SELECT * FROM reservation');
    console.log(`📤 [GET /all] Nombre de réservations récupérées : ${rows.length}`);
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /all] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des réservations." });
  }
});


// 🔍 Récupérer les revenus journaliers de la semaine courante pour un propriétaire
router.get('/revenue/daily/:ownerId', async (req, res) => {
  const { ownerId } = req.params;

  // Jours de la semaine en français
  const daysFr = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Obtenir la date du lundi de la semaine courante
  const now = new Date();
  const dayOfWeek = (now.getDay() + 6) % 7; // 0 = lundi, 6 = dimanche
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek);
  monday.setHours(0, 0, 0, 0);

  // Obtenir la date du dimanche de la semaine courante
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  console.log("📅 [GET /revenue/daily/:ownerId] ownerId :", ownerId);
  console.log("📅 [GET /revenue/daily/:ownerId] Semaine du :", monday.toISOString().slice(0, 10), "au", sunday.toISOString().slice(0, 10));

  try {
    // Récupérer les réservations terminées de la semaine courante pour ce propriétaire
    const sql = `
      SELECT DATE(date_fin) as date_fin, totale
      FROM reservation
      WHERE proprietaire = ?
        AND statut = 1
        AND date_fin >= ? AND date_fin <= ?
        AND date_fin < CURDATE()
    `;
    const params = [ownerId, monday.toISOString().slice(0, 10), sunday.toISOString().slice(0, 10)];
    console.log("🟢 [GET /revenue/daily/:ownerId] SQL :", sql.trim());
    console.log("🟢 [GET /revenue/daily/:ownerId] Params :", params);

    const [rows] = await db.query(sql, params);
    console.log("📦 [GET /revenue/daily/:ownerId] Réservations trouvées :", rows.length, rows);

    // Initialiser les revenus à 0 pour chaque jour
    const revenueByDay = Array(7).fill(0);

    // Remplir les revenus par jour
    rows.forEach(row => {
      const date = new Date(row.date_fin);
      const dayIdx = (date.getDay() + 6) % 7; // 0 = lundi, 6 = dimanche
      revenueByDay[dayIdx] += Number(row.totale) || 0;
      console.log(`💶 [GET /revenue/daily/:ownerId] Ajout de ${row.totale} à ${daysFr[dayIdx]} (${row.date_fin})`);
    });

    // Construire le résultat final
    const result = daysFr.map((day, idx) => ({
      day,
      amount: revenueByDay[idx]
    }));

    console.log("📊 [GET /revenue/daily/:ownerId] Résultat final :", result);

    res.json(result);
  } catch (err) {
    console.error("❌ [GET /revenue/daily/:ownerId] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors du calcul des revenus journaliers." });
  }
});

// 🔍 Revenus par semaine (7 dernières semaines)
router.get('/revenue/weekly/:ownerId', async (req, res) => {
  const { ownerId } = req.params;
  try {
    const sql = `
      SELECT 
        YEARWEEK(date_fin, 1) as week,
        MIN(DATE(date_fin)) as week_start,
        SUM(totale) as amount
      FROM reservation
      WHERE proprietaire = ?
        AND statut = 1
        AND date_fin < CURDATE()
      GROUP BY YEARWEEK(date_fin, 1)
      ORDER BY week_start DESC
      LIMIT 7
    `;
    const [rows] = await db.query(sql, [ownerId]);
    // Formatage pour affichage
    const result = rows.reverse().map(row => ({
      week: row.week,
      week_start: row.week_start,
      amount: Number(row.amount) || 0
    }));
    res.json(result);
  } catch (err) {
    console.error("❌ [GET /revenue/weekly/:ownerId] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors du calcul des revenus hebdomadaires." });
  }
});

// 🔍 Revenus par mois (12 derniers mois)
router.get('/revenue/monthly/:ownerId', async (req, res) => {
  const { ownerId } = req.params;
  try {
    const sql = `
      SELECT 
        DATE_FORMAT(date_fin, '%Y-%m') as month,
        SUM(totale) as amount
      FROM reservation
      WHERE proprietaire = ?
        AND statut = 1
        AND date_fin < CURDATE()
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `;
    const [rows] = await db.query(sql, [ownerId]);
    const result = rows.reverse().map(row => ({
      month: row.month,
      amount: Number(row.amount) || 0
    }));
    res.json(result);
  } catch (err) {
    console.error("❌ [GET /revenue/monthly/:ownerId] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors du calcul des revenus mensuels." });
  }
});

// 🔍 Revenus par année (5 dernières années)
router.get('/revenue/yearly/:ownerId', async (req, res) => {
  const { ownerId } = req.params;
  try {
    const sql = `
      SELECT 
        YEAR(date_fin) as year,
        SUM(totale) as amount
      FROM reservation
      WHERE proprietaire = ?
        AND statut = 1
        AND date_fin < CURDATE()
      GROUP BY year
      ORDER BY year DESC
      LIMIT 5
    `;
    const [rows] = await db.query(sql, [ownerId]);
    const result = rows.reverse().map(row => ({
      year: row.year,
      amount: Number(row.amount) || 0
    }));
    res.json(result);
  } catch (err) {
    console.error("❌ [GET /revenue/yearly/:ownerId] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors du calcul des revenus annuels." });
  }
});

// 🔍 Revenus sur une période personnalisée
// Exemple d'appel : /revenue/custom/:ownerId?start=2025-05-01&end=2025-05-31
router.get('/revenue/custom/:ownerId', async (req, res) => {
  const { ownerId } = req.params;
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Veuillez fournir les paramètres 'start' et 'end' au format YYYY-MM-DD." });
  }

  try {
    const sql = `
      SELECT 
        DATE(date_fin) as date,
        SUM(totale) as amount
      FROM reservation
      WHERE proprietaire = ?
        AND statut = 1
        AND date_fin >= ? AND date_fin <= ?
        AND date_fin < CURDATE()
      GROUP BY date
      ORDER BY date ASC
    `;
    const [rows] = await db.query(sql, [ownerId, start, end]);
    const result = rows.map(row => ({
      date: row.date,
      amount: Number(row.amount) || 0
    }));
    res.json(result);
  } catch (err) {
    console.error("❌ [GET /revenue/custom/:ownerId] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors du calcul des revenus personnalisés." });
  }
});

// 🔢 Compter le nombre de réservations d'un conducteur
router.get('/countReservations/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`📥 [GET /countReservations/:id] id conducteur reçu : ${id}`);

  try {
    const [[{ reservationCount }]] = await db.query(
      'SELECT COUNT(*) AS reservationCount FROM reservation WHERE conducteur = ?',
      [id]
    );
    console.log(`📦 [GET /countReservations/:id] Nombre de réservations trouvées pour le conducteur ${id} :`, reservationCount);

    res.json({ reservationCount });
  } catch (err) {
    console.error("❌ [GET /countReservations/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors du comptage des réservations." });
  }
});

// 🔍 Récupérer toutes les réservations d'une voiture
router.get('/reservations/voiture/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`📥 [GET /reservations/voiture/:id] id voiture reçu : ${id}`);

  try {
    const [rows] = await db.query('SELECT * FROM reservation WHERE voiture = ?', [id]);
    console.log(`[GET /reservations/voiture/:id] Réservations récupérées pour la voiture ${id} :`, rows);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune réservation trouvée pour cette voiture." });
    }

    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /reservations/voiture/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des réservations." });
  }
});

// 🔍 Récupérer les 10 dernières réservations
router.get('/reservations/last10', async (req, res) => {
  console.log("📥 [GET /reservations/last10] Demande de récupération des 10 dernières réservations");
  try {
    const [rows] = await db.query(
      'SELECT * FROM reservation ORDER BY created_at DESC LIMIT 10'
    );
    console.log(`📤 [GET /reservations/last10] Réservations récupérées :`, rows);
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /reservations/last10] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des réservations." });
  }
});

module.exports = router;
