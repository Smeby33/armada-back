const express = require('express');
const db = require('../db');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// 🔧 Fonction pour générer un ID unique pour les styles
const generateIdStyle = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const randomLetters = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
    const randomNumbers = Math.floor(100 + Math.random() * 900); // 3 chiffres
    return randomLetters + randomNumbers;
};
// ➕ Route pour recuper les styles
router.get('/styles/:proprietaire', async (req, res) => {
    const { proprietaire } = req.params;
  
    try {
      const sql = `SELECT * FROM style WHERE proprietaire = ? OR proprietaire IS NULL`;
      const [rows] = await db.query(sql, [proprietaire]);
  
      res.status(200).json(rows);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des styles :', err);
      res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
  

// ➕ Route pour ajouter un style
router.post('/styles/add', async (req, res) => {
    const { name_style, picture, proprietaire, prix, dure } = req.body;

    console.log("📥 Requête reçue pour /styles/add :", req.body);

    // Validation des champs requis
    if (!name_style || !picture || !proprietaire || !prix || !dure) {
        console.log("⚠️ Validation échouée : Champs requis manquants.");
        return res.status(400).json({ error: 'Champs requis manquants.' });
    }

    const id_style = generateIdStyle();

    try {
        console.log("🔍 Préparation de la requête SQL pour ajouter un style...");
        const sql = `INSERT INTO style (id_style, name_style, picture, proprietaire, prix, dure) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [id_style, name_style, picture, proprietaire, prix, dure];

        console.log("📤 Exécution de la requête SQL avec les valeurs :", values);
        await db.query(sql, values);

        console.log("✅ Style ajouté avec succès :", id_style);
        res.status(201).json({ message: 'Style ajouté avec succès.', id_style });
    } catch (err) {
        console.error('❌ Erreur lors de l\'ajout du style :', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// ✏️ Route pour mettre à jour un style
router.put('/styles/update/:proprietaire/:id_style', async (req, res) => {
    const { proprietaire, id_style } = req.params;
    const { name_style, picture, prix, dure } = req.body;

    console.log("📥 Requête reçue pour /styles/update :", { proprietaire, id_style, body: req.body });

    // Validation des champs requis
    if (!proprietaire || !id_style) {
        console.log("⚠️ Validation échouée : proprietaire et id_style sont requis.");
        return res.status(400).json({ error: 'proprietaire et id_style sont requis.' });
    }

    try {
        console.log("🔍 Préparation de la requête SQL pour mettre à jour un style...");
        const sql = `
            UPDATE style 
            SET name_style = ?, picture = ?, prix = ?, dure = ? 
            WHERE id_style = ? AND proprietaire = ?
        `;
        // Corrigez l'ordre des valeurs ici
        const values = [name_style, picture, prix, dure, id_style, proprietaire];

        console.log("📤 Exécution de la requête SQL avec les valeurs :", values);
        const [result] = await db.query(sql, values);

        console.log("📤 Résultat de la requête SQL :", result);

        if (result.affectedRows === 0) {
            console.log("⚠️ Aucun style trouvé ou non autorisé :", { proprietaire, id_style });
            return res.status(404).json({ error: 'Style introuvable ou non autorisé.' });
        }

        console.log("✅ Style mis à jour avec succès :", id_style);
        res.status(200).json({ message: 'Style mis à jour avec succès.' });
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du style :', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// 🗑️ Route pour supprimer un style spécifique
router.delete('/styles/delete/:proprietaire/:id_style', async (req, res) => {
    const { proprietaire, id_style } = req.params;

    console.log("📥 Requête reçue pour /styles/delete :", { proprietaire, id_style });

    // Validation des champs requis
    if (!proprietaire || !id_style) {
        console.log("⚠️ Validation échouée : proprietaire et id_style sont requis.");
        return res.status(400).json({ error: 'proprietaire et id_style sont requis.' });
    }

    try {
        console.log("🔍 Préparation de la requête SQL pour supprimer un style...");
        const sql = `DELETE FROM style WHERE id_style = ? AND proprietaire = ?`;
        const values = [id_style, proprietaire];

        console.log("📤 Exécution de la requête SQL avec les valeurs :", values);
        const [result] = await db.query(sql, values);

        console.log("📤 Résultat de la requête SQL :", result);

        if (result.affectedRows === 0) {
            console.log("⚠️ Aucun style trouvé ou non autorisé :", { proprietaire, id_style });
            return res.status(404).json({ error: 'Style introuvable ou non autorisé.' });
        }

        console.log("✅ Style supprimé avec succès :", id_style);
        res.status(200).json({ message: 'Style supprimé avec succès.' });
    } catch (err) {
        console.error('❌ Erreur lors de la suppression du style :', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// 🗑️ Route pour supprimer tous les styles d'un propriétaire
router.delete('/styles/delete/:proprietaire', async (req, res) => {
    const { proprietaire } = req.params;

    console.log("📥 Requête reçue pour /styles/delete tous les styles :", { proprietaire });

    // Validation des champs requis
    if (!proprietaire) {
        console.log("⚠️ Validation échouée : Le champ proprietaire est requis.");
        return res.status(400).json({ error: 'Le champ proprietaire est requis.' });
    }

    try {
        console.log("🔍 Préparation de la requête SQL pour supprimer tous les styles d'un propriétaire...");
        const sql = `DELETE FROM style WHERE proprietaire = ?`;
        const values = [proprietaire];

        console.log("📤 Exécution de la requête SQL avec les valeurs :", values);
        const [result] = await db.query(sql, values);

        console.log("📤 Résultat de la requête SQL :", result);

        if (result.affectedRows === 0) {
            console.log("⚠️ Aucun style trouvé pour ce propriétaire :", proprietaire);
            return res.status(404).json({ error: 'Aucun style trouvé pour ce propriétaire.' });
        }

        console.log("✅ Tous les styles du propriétaire supprimés avec succès :", proprietaire);
        res.status(200).json({ message: 'Styles supprimés avec succès.' });
    } catch (err) {
        console.error('❌ Erreur lors de la suppression des styles :', err);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

module.exports = router;