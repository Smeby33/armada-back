const express = require('express');
const db = require('../db');

const router = express.Router();

// ➕ Ajouter un owner
router.post('/addOwner', async (req, res) => {
    const { id, fullname, email, phone, documentcni } = req.body;

    console.log("📥 Requête reçue pour /addOwner :", req.body);

    if (!id || !fullname || !email || !phone || !documentcni) {
        console.log("⚠️ Champs manquants");
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const sql = `
            INSERT INTO owner (id, fullname, email, phone, documentcni)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [id, fullname, email, phone, documentcni]);

        console.log("✅ Owner ajouté avec succès :", result);
        res.status(201).json({ message: "Owner ajouté avec succès" });
    } catch (error) {
        console.error("❌ Erreur SQL :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// 🔍 Récupérer un owner par ID
router.get('/getOwner/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = `SELECT * FROM owner WHERE id = ?`;
        const [rows] = await db.query(sql, [id]);

        console.log("📦 Owner récupéré :", rows);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Owner introuvable." });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération :", error);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// 🔍 Récupérer tous les owners
router.get('/getAllOwners', async (req, res) => {
    try {
        const sql = "SELECT * FROM owner";
        const [rows] = await db.query(sql);
        console.log("📦 Owners récupérés :", rows);
        res.status(200).json(rows);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des owners :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// ✏️ Modifier un owner
router.put('/updateOwner/:id', async (req, res) => {
    const { id } = req.params;
    const {
        fullname,
        email,
        phone,
        documentcni,
        companyname,
        numeronif,
        picture,
        adresse,
        latitude,
        longitude
    } = req.body;

    console.log("📥 Requête reçue pour /updateOwner :", id, req.body);

    try {
        const sql = `
            UPDATE owner SET
                fullname = ?,
                email = ?,
                phone = ?,
                documentcni = ?,
                companyname = ?,
                numeronif = ?,
                picture = ?,
                adresse = ?,
                latitude = ?,
                longitude = ?
            WHERE id = ?
        `;

        const values = [
            fullname,
            email,
            phone,
            documentcni,
            companyname || null,
            numeronif || null,
            picture || null,
            adresse || null,
            latitude || null,
            longitude || null,
            id
        ];

        const [result] = await db.query(sql, values);

        console.log("✅ Owner mis à jour :", result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Owner introuvable." });
        }

        res.status(200).json({ message: "Owner mis à jour avec succès." });
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// 🗑️ Supprimer un owner
router.delete('/deleteOwner/:id', async (req, res) => {
    const { id } = req.params;

    console.log("🗑️ Requête reçue pour /deleteOwner :", id);

    try {
        const sql = "DELETE FROM owner WHERE id = ?";
        const [result] = await db.query(sql, [id]);

        console.log("🗑️ Résultat suppression :", result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Owner introuvable." });
        }

        res.status(200).json({ message: "Owner supprimé avec succès." });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// 🔢 Compter le nombre de voitures d'un owner
router.get('/countCars/:ownerId', async (req, res) => {
    const { ownerId } = req.params;
    try {
        const sql = "SELECT COUNT(*) AS carCount FROM car WHERE proprio = ?";
        const [[{ carCount }]] = await db.query(sql, [ownerId]);
        console.log(`🚗 Nombre de voitures pour owner ${ownerId} :`, carCount);
        res.status(200).json({ carCount });
    } catch (err) {
        console.error("❌ Erreur lors du comptage des voitures :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

module.exports = router;
