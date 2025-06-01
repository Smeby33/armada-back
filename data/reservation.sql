-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 21 mai 2025 à 15:23
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
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id` varchar(20) NOT NULL,
  `conducteur` varchar(200) NOT NULL,
  `voiture` varchar(200) NOT NULL,
  `proprietaire` varchar(200) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `avance` int(11) NOT NULL,
  `caution` int(11) NOT NULL,
  `livraison` int(11) NOT NULL,
  `heuredeprise` time NOT NULL,
  `heurederetour` int(11) NOT NULL,
  `totale` int(11) NOT NULL,
  `statut` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conducteur` (`conducteur`),
  ADD KEY `voiture` (`voiture`),
  ADD KEY `proprietaire` (`proprietaire`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`conducteur`) REFERENCES `renter` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`voiture`) REFERENCES `car` (`id`),
  ADD CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`proprietaire`) REFERENCES `owner` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
