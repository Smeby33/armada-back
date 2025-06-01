const express = require('express');
const db = require('../db');

const router = express.Router();

// Générer un ID unique pour favoris
function generateFavorisId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const numbers = Math.floor(100000 + Math.random() * 900000);
  return prefix + numbers;
}

// ➕ Ajouter un favori
router.post('/favoris', async (req, res) => {
  const { voiture, chauffeur, proprio } = req.body;
  const id = generateFavorisId();
  console.log("📥 [POST /favoris] Données reçues :", req.body);

  if (!voiture || !chauffeur || !proprio) {
    console.log("❌ [POST /favoris] Champs requis manquants :", req.body);
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    await db.query(
      'INSERT INTO favoris (id, voiture, chauffeur, proprio) VALUES (?, ?, ?, ?)',
      [id, voiture, chauffeur, proprio]
    );
    console.log("✅ [POST /favoris] Ajouté avec succès, id :", id);
    res.status(201).json({ message: 'Favori ajouté avec succès', id });
  } catch (err) {
    console.error("❌ [POST /favoris] Erreur SQL :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// 🔍 Récupérer un favori par voiture et chauffeur
router.get('/favoris/unique/:voiture/:chauffeur', async (req, res) => {
  const { voiture, chauffeur } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM favoris WHERE voiture = ? AND chauffeur = ?',
      [voiture, chauffeur]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Favori non trouvé pour cette voiture et ce chauffeur." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ [GET /favoris/unique/:voiture/:chauffeur] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération du favori." });
  }
});

// 🔍 Récupérer tous les favoris
router.get('/favoris', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM favoris');
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /favoris] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des favoris." });
  }
});

// 🔍 Récupérer les favoris d'un chauffeur
router.get('/favoris/chauffeur/:chauffeur', async (req, res) => {
  const { chauffeur } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM favoris WHERE chauffeur = ?', [chauffeur]);
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /favoris/chauffeur/:chauffeur] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des favoris." });
  }
});

// 🔍 Récupérer un favori par ID
router.get('/favoris/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM favoris WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Favori non trouvé." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ [GET /favoris/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la récupération du favori." });
  }
});

// 🗑️ Supprimer un favori
router.delete('/favoris/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM favoris WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Favori non trouvé." });
    }
    res.json({ message: "Favori supprimé avec succès." });
  } catch (err) {
    console.error("❌ [DELETE /favoris/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur lors de la suppression." });
  }
});

module.exports = router;