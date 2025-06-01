const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

// ➕ Ajouter un client
router.post('/renter/add', async (req, res) => {
  console.log("📥 [POST /renter/add] Données reçues :", req.body);

  // L'id vient du front-end
  const { id, fullname, email, phone, cni, permis } = req.body;
  console.log("🔎 [POST /renter/add] id reçu du front :", id);

  if (!id || !fullname || !email || !phone || !cni || !permis) {
    console.log("❌ [POST /renter/add] Champs requis manquants :", req.body);
    return res.status(400).json({ message: 'Champs requis manquants.' });
  }

  try {
    console.log("🟢 [POST /renter/add] Tentative d'insertion SQL avec :", [id, fullname, email, phone, cni, permis]);
    await db.query(
      'INSERT INTO renter (id, fullname, email, phone, cni, permis) VALUES (?, ?, ?, ?, ?, ?)',
      [id, fullname, email, phone, cni, permis]
    );
    console.log("✅ [POST /renter/add] Renter ajouté avec succès, id :", id);
    res.status(201).json({ message: 'Renter ajouté avec succès', id });
  } catch (err) {
    console.error("❌ [POST /renter/add] Erreur serveur lors de l'insertion :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// 🔍 Récupérer un client par ID
router.get('/getRenter/:id', async (req, res) => {
  const { id } = req.params;
  console.log("📥 [GET /:id] id reçu :", id);
  try {
    const [rows] = await db.query('SELECT * FROM renter WHERE id = ?', [id]);
    console.log("📤 [GET /:id] Résultat SQL :", rows);
    if (rows.length === 0) {
      console.log("❌ [GET /:id] Renter non trouvé pour id :", id);
      return res.status(404).json({ message: 'Renter non trouvé' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ [GET /:id] Erreur serveur :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// ✏️ Modifier un client
router.put('/modifier/renter/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  console.log("📥 [PUT /renter/:id] id reçu :", id);
  console.log("📥 [PUT /renter/:id] champs reçus :", fields);

  if (Object.keys(fields).length === 0) {
    console.log("⚠️ [PUT /renter/:id] Aucun champ fourni pour la mise à jour.");
    return res.status(400).json({ error: "Aucun champ fourni pour la mise à jour." });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), id];

  console.log("🟢 [PUT /renter/:id] requête SQL :", `UPDATE renter SET ${updates} WHERE id = ?`);
  console.log("🟢 [PUT /renter/:id] valeurs SQL :", values);

  try {
    const sql = `UPDATE renter SET ${updates} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    console.log("📤 [PUT /renter/:id] Résultat SQL :", result);
    if (result.affectedRows === 0) {
      console.log("❌ [PUT /renter/:id] Locataire non trouvé pour l'id :", id);
      return res.status(404).json({ error: "Locataire non trouvé." });
    }
    res.json({ message: "Locataire mis à jour avec succès." });
  } catch (err) {
    console.error("❌ [PUT /renter/:id] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// 🗑 Supprimer un client
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("📥 [DELETE /:id] id reçu :", id);
  try {
    const [result] = await db.query('DELETE FROM renter WHERE id = ?', [id]);
    console.log("📤 [DELETE /:id] Résultat SQL :", result);
    if (result.affectedRows === 0) {
      console.log("❌ [DELETE /:id] Renter non trouvé pour id :", id);
      return res.status(404).json({ message: 'Renter non trouvé' });
    }
    res.json({ message: 'Renter supprimé avec succès' });
  } catch (err) {
    console.error("❌ [DELETE /:id] Erreur serveur :", err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

module.exports = router;
