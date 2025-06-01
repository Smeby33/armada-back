const express = require('express');
const db = require('../db');

const router = express.Router();

// Générer un ID unique pour paiement
function generatePaiementId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const numbers = Math.floor(100000 + Math.random() * 900000);
  return prefix + numbers;
}

// ➕ Ajouter un paiement
router.post('/addPaiement', async (req, res) => {
  const { conducteur, fullname, type, reseau, numero, expire_date } = req.body;
  const id = generatePaiementId();
  console.log("📥 [POST /paiement] Données reçues :", req.body);

  if (!conducteur || !fullname || !type || !reseau || !numero) {
    console.log("❌ [POST /paiement] Champs requis manquants :", req.body);
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    await db.query(
      'INSERT INTO paiement (id, conducteur, fullname, type, reseau, numero, expire_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, conducteur, fullname, type, reseau, numero, expire_date || null]
    );
    console.log("✅ [POST /paiement] Ajouté avec succès, id :", id);
    res.status(201).json({ message: 'Paiement ajouté avec succès', id });
  } catch (err) {
    console.error("❌ [POST /paiement] Erreur SQL :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// 🔍 Récupérer tous les paiements
router.get('/getAllPaiement', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM paiement');
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /paiement] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des paiements." });
  }
});

// 🔍 Récupérer les paiements d'un conducteur
router.get('/getPaiement/conducteur/:conducteur', async (req, res) => {
  const { conducteur } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM paiement WHERE conducteur = ?', [conducteur]);
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /paiement/conducteur/:conducteur] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des paiements." });
  }
});

// 🔍 Récupérer un paiement par ID
router.get('/paiement/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM paiement WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Paiement non trouvé." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ [GET /paiement/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération du paiement." });
  }
});

// ✏️ Modifier un paiement
router.put('/updatePaiement/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "Aucun champ fourni pour la mise à jour." });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), id];

  try {
    const sql = `UPDATE paiement SET ${updates} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paiement non trouvé." });
    }
    res.json({ message: "Paiement mis à jour avec succès." });
  } catch (err) {
    console.error("❌ [PUT /paiement/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

// 🗑️ Supprimer un paiement
router.delete('/delettePaiement/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM paiement WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Paiement non trouvé." });
    }
    res.json({ message: "Paiement supprimé avec succès." });
  } catch (err) {
    console.error("❌ [DELETE /paiement/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

module.exports = router;