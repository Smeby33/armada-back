const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();
function generateRegleId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
                          letters.charAt(Math.floor(Math.random() * letters.length));
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return randomLetters + randomDigits;
}

// ➕ Ajouter une règle
router.post('/regle', async (req, res) => {
  const { age, livraison, idproprio, fumer, animaux } = req.body;

  if (!idproprio) {
    return res.status(400).json({ error: "L'identifiant du propriétaire est requis." });
  }

  const id = generateRegleId();
  console.log("🆔 [POST /regle] id généré pour la règle :", id);

  try {
    const sql = 'INSERT INTO regle (id, age, livraison, idproprio, fumer, animaux) VALUES (?, ?, ?, ?, ?, ?)';
    console.log("🟢 [POST /regle] requête SQL :", sql);
    const [result] = await db.query(sql, [id, age, livraison, idproprio, fumer, animaux]);
    console.log("✅ Règle ajoutée avec succès :", result);
    res.status(201).json({ message: "Règle ajoutée avec succès.", id });
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// 🔍 Récupérer une règle par ID
router.get('/regle/:idproprio', async (req, res) => {
  const { idproprio } = req.params;

  try {
    const [rows] = await db.query('SELECT * FROM regle WHERE `idproprio` = ?', [idproprio]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Règle non trouvée pour ce propriétaire." });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});


// 🔄 Modifier une règle par IDPROPRIO
router.put('/regle/update/:idproprio', async (req, res) => {
  const { idproprio } = req.params;
  const fields = req.body;

  console.log("📥 [PUT /regle/update/:idproprio] idproprio reçu :", idproprio);
  console.log("📥 [PUT /regle/update/:idproprio] champs reçus :", fields);

  if (Object.keys(fields).length === 0) {
    console.log("⚠️ [PUT /regle/update/:idproprio] Aucun champ fourni pour la mise à jour.");
    return res.status(400).json({ error: "Aucun champ fourni pour la mise à jour." });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(fields), idproprio];

  console.log("🟢 [PUT /regle/update/:idproprio] requête SQL :", `UPDATE regle SET ${updates} WHERE idproprio = ?`);
  console.log("🟢 [PUT /regle/update/:idproprio] valeurs SQL :", values);

  try {
    const sql = `UPDATE regle SET ${updates} WHERE idproprio = ?`;
    const [result] = await db.query(sql, values);
    console.log("📤 [PUT /regle/update/:idproprio] Résultat SQL :", result);
    if (result.affectedRows === 0) {
      console.log("❌ [PUT /regle/update/:idproprio] Règle non trouvée pour idproprio :", idproprio);
      return res.status(404).json({ error: "Règle non trouvée." });
    }
    res.json({ message: "Règle mise à jour avec succès." });
  } catch (err) {
    console.error("❌ [PUT /regle/update/:idproprio] Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// ❌ Supprimer une règle par ID
router.delete('/regle/delete/:idproprio', async (req, res) => {
  const { idproprio } = req.params;

  try {
    const sql = 'DELETE FROM regle WHERE `idproprio` = ?';
    const [result] = await db.query(sql, [idProprio]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Règle non trouvée." });
    }
    res.json({ message: "Règle supprimée avec succès." });
  } catch (err) {
    console.error("❌ Erreur SQL :", err);
    res.status(500).json({ error: "Erreur serveur." });
  }
});



module.exports = router;
