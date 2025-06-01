const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

// 🔠 Générer un ID unique pour une voiture : 2 lettres + 6 chiffres
function generateCarId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
                          letters.charAt(Math.floor(Math.random() * letters.length));
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return randomLetters + randomDigits;
}

// 🚗 Ajouter une voiture
router.post('/addCar', async (req, res) => {
    const {
        marque, modele, type, description, ville,
        sunroof, androidauto, clime, bluetooth,
        photofront, photoback, photoleft, photorigth,
        prix, avance, proprio, fuel, comission
    } = req.body;

    if (!marque || !modele || !type || !ville || !photofront || !photoback || !photoleft || !photorigth || !prix || !proprio|| !fuel || !comission) {
        return res.status(400).json({ error: "Certains champs obligatoires sont manquants." });
    }

    const id = generateCarId();

    try {
        const sql = `
            INSERT INTO car (id, marque, modele, type, description, ville, sunroof, androidauto, clime, bluetooth, 
                photofront, photoback, photoleft, photorigth, prix, avance, proprio,fuel, comission)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [id, marque, modele, type, description, ville, sunroof, androidauto, clime, bluetooth,
            photofront, photoback, photoleft, photorigth, prix, avance, proprio, fuel, comission];
        console.log("🟢 [POST /addCar] requête SQL :", sql);

        await db.query(sql, values);
        res.status(201).json({ message: "Voiture ajoutée avec succès", id });
    } catch (err) {
        console.error("❌ Erreur SQL :", err);
        res.status(500).json({ error: "Erreur serveur lors de l'ajout de la voiture." });
    }
});

// 🔍 Récupérer une voiture par ID
router.get('/car/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM car WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: "Voiture introuvable." });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération." });
    }
});

// 🔍 Récupérer toutes les voitures d’un propriétaire
router.get('/cars/byOwner/:proprio', async (req, res) => {
    const { proprio } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM car WHERE proprio = ?', [proprio]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des voitures." });
    }
});

// 🔍 Récupérer toutes les voitures
router.get('/allCars', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM car');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des voitures." });
    }
});

// ✏️ Modifier une voiture (partiel autorisé)
router.put('/car/:id', async (req, res) => {
    const { id } = req.params;
    const fields = req.body;

    console.log("🟢 [PUT /car/:id] id reçu :", id);
    console.log("🟢 [PUT /car/:id] champs reçus :", fields);

    if (Object.keys(fields).length === 0) {
        console.log("⚠️ Aucun champ fourni pour la mise à jour.");
        return res.status(400).json({ error: "Aucun champ fourni pour la mise à jour." });
    }

    const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    console.log("🟢 [PUT /car/:id] requête SQL :", `UPDATE car SET ${updates} WHERE id = ?`);
    console.log("🟢 [PUT /car/:id] valeurs SQL :", values);

    try {
        const sql = `UPDATE car SET ${updates} WHERE id = ?`;
        const [result] = await db.query(sql, values);
        if (result.affectedRows === 0) {
            console.log("❌ Voiture non trouvée pour l'id :", id);
            return res.status(404).json({ error: "Voiture non trouvée." });
        }
        res.json({ message: "Voiture mise à jour avec succès." });
    } catch (err) {
        console.error("❌ Erreur SQL :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// 🗑️ Supprimer une voiture
router.delete('/car/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM car WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Voiture non trouvée." });
        res.json({ message: "Voiture supprimée avec succès." });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression." });
    }
});

// 🗑️ Supprimer toutes les voitures d’un propriétaire
router.delete('/cars/byOwner/:proprio', async (req, res) => {
    const { proprio } = req.params;
    try {
        const [result] = await db.query('DELETE FROM car WHERE proprio = ?', [proprio]);
        res.json({ message: `Toutes les voitures du propriétaire ${proprio} ont été supprimées.` });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression multiple." });
    }
});

module.exports = router;
