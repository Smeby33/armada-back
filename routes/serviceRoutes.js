const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

// Utilitaire pour générer un ID format "AB123"
function generateServiceId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * 26)] + letters[Math.floor(Math.random() * 26)];
  const numbers = Math.floor(100 + Math.random() * 900); // 3 chiffres
  return prefix + numbers;
}

// ➕ Ajouter un service
router.post('/addService', async (req, res) => {
  const {
    type, description, duree, teinture = 'Non', prix, picture, salon
  } = req.body;

  console.log("📥 Requête reçue pour /addService avec les données :", req.body);

  if (!type || !prix || !salon) {
    console.log("⚠️ Validation échouée : Champs manquants");
    return res.status(400).json({ error: 'type, prix et salon sont requis.' });
  }

  const id_service = generateServiceId(); // Utilisez id_service ici

  try {
    console.log("🔍 Préparation de la requête SQL...");
    const sql = `INSERT INTO services (id_service, type, description, duree, teinture, prix, picture, salon)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [id_service, type, description || null, duree || null, teinture, prix, picture || null, salon];
    console.log("📤 Exécution de la requête SQL avec les valeurs :", values);

    await db.query(sql, values);
    console.log("✅ Service ajouté avec succès :", id_service);
    res.status(201).json({ message: 'Service ajouté avec succès.', id_service });
  } catch (error) {
    console.error('❌ Erreur SQL (addService) :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// 🔍 Récupérer un service par ID
router.get('/getService/:id_service', async (req, res) => {
  const { id_service } = req.params;
  console.log("📥 Requête reçue pour /getService avec l'ID :", id_service);

  try {
    console.log("🔍 Préparation de la requête SQL...");
    const [result] = await db.query('SELECT * FROM services WHERE id_service = ?', [id_service]);
    console.log("📤 Résultat de la requête SQL :", result);

    if (result.length === 0) {
      console.log("⚠️ Aucun service trouvé avec l'ID :", id_service);
      return res.status(404).json({ error: 'Service non trouvé.' });
    }

    console.log("✅ Service trouvé :", result[0]);
    res.json(result[0]);
  } catch (error) {
    console.error('❌ Erreur SQL (getService) :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// 📋 Récupérer tous les services d’un salon
router.get('/getServicesBySalon/:salonId', async (req, res) => {
  const { salonId } = req.params;
  console.log("📥 Requête reçue pour /getServicesBySalon avec le salon ID :", salonId);

  try {
    console.log("🔍 Préparation de la requête SQL...");
    const [rows] = await db.query('SELECT * FROM services WHERE salon = ?', [salonId]);
    console.log("📤 Résultat de la requête SQL :", rows);

    res.json(rows);
  } catch (error) {
    console.error('❌ Erreur SQL (getServicesBySalon) :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ❌ Supprimer un service
router.delete('/deleteService/:id', async (req, res) => {
  const { id } = req.params;
  console.log("📥 Requête reçue pour /deleteService avec l'ID :", id);

  try {
    console.log("🔍 Préparation de la requête SQL...");
    const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);
    console.log("📤 Résultat de la requête SQL :", result);

    if (result.affectedRows === 0) {
      console.log("⚠️ Aucun service trouvé avec l'ID :", id);
      return res.status(404).json({ error: 'Service non trouvé.' });
    }

    console.log("✅ Service supprimé avec succès :", id);
    res.json({ message: 'Service supprimé avec succès.' });
  } catch (error) {
    console.error('❌ Erreur SQL (deleteService) :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// 🛠️ Modifier un service
router.put('/updateService/:id_service', async (req, res) => {
  const { id_service } = req.params;
  const { type, description, duree, teinture, prix, picture } = req.body;

  console.log("📥 Requête reçue pour /updateService avec l'ID :", id_service);
  console.log("📥 Données reçues :", req.body);

  try {
    console.log("🔍 Préparation de la requête SQL...");
    const sql = `UPDATE services 
                 SET type = ?, description = ?, duree = ?, teinture = ?, prix = ?, picture = ?
                 WHERE id_service = ?`;
    const values = [type, description, duree, teinture, prix, picture, id_service];
    console.log("📤 Exécution de la requête SQL avec les valeurs :", values);

    const [result] = await db.query(sql, values);
    console.log("📤 Résultat de la requête SQL :", result);

    if (result.affectedRows === 0) {
      console.log("⚠️ Aucun service trouvé avec l'ID :", id_service);
      return res.status(404).json({ error: 'Service non trouvé.' });
    }

    console.log("✅ Service mis à jour avec succès :", id_service);
    res.json({ message: 'Service mis à jour avec succès.' });
  } catch (error) {
    console.error('❌ Erreur SQL (updateService) :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
