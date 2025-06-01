-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 21 mai 2025 à 08:54
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `armada`
--

-- --------------------------------------------------------

--
-- Structure de la table `regle`
--

CREATE TABLE `regle` (
  `age` varchar(10) DEFAULT NULL,
  `livraison` tinyint(4) NOT NULL DEFAULT 0,
  `id-proprio` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `regle`
--
ALTER TABLE `regle`
  ADD KEY `id-proprio` (`id-proprio`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `regle`
--
ALTER TABLE `regle`
  ADD CONSTRAINT `regle_ibfk_1` FOREIGN KEY (`id-proprio`) REFERENCES `owner` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
