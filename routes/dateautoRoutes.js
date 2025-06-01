const express = require('express');
const db = require('../db');

const router = express.Router();

// Générer un ID unique pour dateauto
function generateDateautoId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const numbers = Math.floor(100000 + Math.random() * 900000);
  return prefix + numbers;
}

// ➕ Ajouter une période dateauto
router.post('/addDateauto', async (req, res) => {
  const { conducteurId, dateDebut, dateFin } = req.body;
  const id = generateDateautoId();
  console.log("📥 [POST /dateauto] Données reçues :", req.body);

  if (!conducteurId || !dateDebut || !dateFin) {
    console.log("❌ [POST /dateauto] Champs requis manquants :", req.body);
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    await db.query(
      'INSERT INTO dateauto (id, conducteurId, dateDebut, dateFin) VALUES (?, ?, ?, ?)',
      [id, conducteurId, dateDebut, dateFin]
    );
    console.log("✅ [POST /dateauto] Ajouté avec succès, id :", id);
    res.status(201).json({ message: 'Dateauto ajoutée avec succès', id });
  } catch (err) {
    console.error("❌ [POST /dateauto] Erreur SQL :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// 🔍 Récupérer toutes les périodes
router.get('/getDateauto', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM dateauto');
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /dateauto] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des périodes." });
  }
});

// 🔍 Récupérer une période par ID
router.get('/dateauto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM dateauto WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Période non trouvée." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ [GET /dateauto/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération de la période." });
  }
});

// 🔍 Récupérer la dernière période d'un conducteur
router.get('/dateauto/last/:conducteurId', async (req, res) => {
  const { conducteurId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM dateauto WHERE conducteurId = ? ORDER BY createAt DESC LIMIT 1',
      [conducteurId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucune période trouvée pour ce conducteur." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ [GET /dateauto/last/:conducteurId] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération de la période." });
  }
});

// ✏️ Modifier une période
router.put('/dateauto/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "Aucun champ fourni pour la mise à jour." });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), id];

  try {
    const sql = `UPDATE dateauto SET ${updates} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Période non trouvée." });
    }
    res.json({ message: "Période mise à jour avec succès." });
  } catch (err) {
    console.error("❌ [PUT /dateauto/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour." });
  }
});

// 🗑️ Supprimer une période
router.delete('/dateauto/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM dateauto WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Période non trouvée." });
    }
    res.json({ message: "Période supprimée avec succès." });
  } catch (err) {
    console.error("❌ [DELETE /dateauto/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

module.exports = router;