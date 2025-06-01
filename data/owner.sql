-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 17 mai 2025 à 14:34
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
-- Structure de la table `owner`
--

CREATE TABLE `owner` (
  `id` varchar(200) NOT NULL,
  `fullname` varchar(200) NOT NULL,
  `email` varchar(20) NOT NULL,
  `phone` int(20) NOT NULL,
  `documentcni` text NOT NULL,
  `companyname` varchar(100) DEFAULT NULL,
  `numeronif` varchar(100) DEFAULT NULL,
  `picture` varchar(200) DEFAULT NULL,
  `adresse` varchar(100) DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `owner`
--

INSERT INTO `owner` (`id`, `fullname`, `email`, `phone`, `documentcni`, `companyname`, `numeronif`, `picture`, `adresse`, `latitude`, `longitude`) VALUES
('XE0l49Z5DBaTe1zu8VOBEFlyaww1', 'Smeb Edoh', 'smeb@gmail.com', 77679339, 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747402824/armada_auto/sveehoa6wztwv0zjdlrj.png', NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `owner`
--
ALTER TABLE `owner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
