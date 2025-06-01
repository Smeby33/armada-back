const express = require('express');
const db = require('../db');

const router = express.Router();

// Générer un ID unique pour rating
function generateRatingId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const numbers = Math.floor(100000 + Math.random() * 900000);
  return prefix + numbers;
}

// ➕ Ajouter un rating
router.post('/rating', async (req, res) => {
  const { id_reservation, voiture, proprietaire, conducteur, points, commentaire } = req.body;
  const id = generateRatingId();
  console.log("📥 [POST /rating] Données reçues :", req.body);

  if (!id_reservation || !voiture || !proprietaire || !conducteur || points === undefined) {
    console.log("❌ [POST /rating] Champs requis manquants :", req.body);
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    await db.query(
      'INSERT INTO rating (id, id_reservation, voiture, proprietaire, conducteur, points, commentaire) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, id_reservation, voiture, proprietaire, conducteur, points, commentaire || null]
    );
    console.log("✅ [POST /rating] Ajouté avec succès, id :", id);
    res.status(201).json({ message: 'Rating ajouté avec succès', id });
  } catch (err) {
    console.error("❌ [POST /rating] Erreur SQL :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// 🔍 Récupérer tous les ratings
router.get('/rating', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rating');
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /rating] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des ratings." });
  }
});

// 🔍 Récupérer un rating par ID
router.get('/rating/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM rating WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Rating non trouvé." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ [GET /rating/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération du rating." });
  }
});

// 🔍 Récupérer tous les ratings d'une voiture
router.get('/rating/voiture/:voiture', async (req, res) => {
  const { voiture } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM rating WHERE voiture = ?', [voiture]);
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /rating/voiture/:voiture] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des ratings." });
  }
});

// 🔍 Récupérer tous les ratings d'un conducteur
router.get('/rating/conducteur/:conducteur', async (req, res) => {
  const { conducteur } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM rating WHERE conducteur = ?', [conducteur]);
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /rating/conducteur/:conducteur] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des ratings." });
  }
});

// 🔍 Récupérer tous les ratings d'un propriétaire
router.get('/rating/proprietaire/:proprietaire', async (req, res) => {
  const { proprietaire } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM rating WHERE proprietaire = ?', [proprietaire]);
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /rating/proprietaire/:proprietaire] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des ratings." });
  }
});

// ✏️ Modifier un rating
router.put('/rating/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "Aucun champ fourni pour la mise à jour." });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), id];

  try {
    const sql = `UPDATE rating SET ${updates} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rating non trouvé." });
    }
    res.json({ message: "Rating mis à jour avec succès." });
  } catch (err) {
    console.error("❌ [PUT /rating/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

// 🗑️ Supprimer un rating
router.delete('/rating/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM rating WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rating non trouvé." });
    }
    res.json({ message: "Rating supprimé avec succès." });
  } catch (err) {
    console.error("❌ [DELETE /rating/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

module.exports = router;
