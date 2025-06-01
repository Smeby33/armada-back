-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 31 mai 2025 à 01:16
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
-- Structure de la table `rating`
--

CREATE TABLE `rating` (
  `id` varchar(50) NOT NULL,
  `id_reservation` varchar(50) NOT NULL,
  `voiture` varchar(255) NOT NULL,
  `proprietaire` varchar(255) NOT NULL,
  `conducteur` varchar(255) NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `rating`
--
ALTER TABLE `rating`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_reservation` (`id_reservation`),
  ADD KEY `proprietaire` (`proprietaire`),
  ADD KEY `conducteur` (`conducteur`),
  ADD KEY `voiture` (`voiture`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `rating`
--
ALTER TABLE `rating`
  ADD CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`id_reservation`) REFERENCES `reservation` (`id`),
  ADD CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`proprietaire`) REFERENCES `owner` (`id`),
  ADD CONSTRAINT `rating_ibfk_3` FOREIGN KEY (`conducteur`) REFERENCES `renter` (`id`),
  ADD CONSTRAINT `rating_ibfk_4` FOREIGN KEY (`voiture`) REFERENCES `car` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
