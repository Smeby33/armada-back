-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 20 mai 2025 à 12:31
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
-- Structure de la table `car`
--

CREATE TABLE `car` (
  `id` varchar(10) NOT NULL,
  `marque` varchar(10) NOT NULL,
  `modele` varchar(10) NOT NULL,
  `type` varchar(10) NOT NULL,
  `description` text DEFAULT NULL,
  `ville` varchar(15) NOT NULL,
  `sunroof` tinyint(1) NOT NULL DEFAULT 0,
  `androidauto` tinyint(1) NOT NULL DEFAULT 0,
  `clime` tinyint(1) NOT NULL DEFAULT 0,
  `bluetooth` tinyint(1) NOT NULL DEFAULT 0,
  `photofront` varchar(200) NOT NULL,
  `photoback` varchar(200) NOT NULL,
  `photoleft` varchar(200) NOT NULL,
  `photorigth` varchar(200) NOT NULL,
  `prix` int(10) NOT NULL,
  `avance` tinyint(1) NOT NULL DEFAULT 0,
  `proprio` varchar(100) NOT NULL,
  `statut` tinyint(4) DEFAULT 0,
  `fuel` varchar(200) DEFAULT NULL,
  `comission` tinyint(10) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `car`
--

INSERT INTO `car` (`id`, `marque`, `modele`, `type`, `description`, `ville`, `sunroof`, `androidauto`, `clime`, `bluetooth`, `photofront`, `photoback`, `photoleft`, `photorigth`, `prix`, `avance`, `proprio`, `statut`, `fuel`, `comission`) VALUES
('KW880366', 'Toyota', 'fortuner 2', 'minibus', 'cdvdfdqscqsdc', 'Abidjan', 0, 1, 1, 1, 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747575098/armada_auto/vehicles/favkdwlwvorlh4i0xz6x.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747575105/armada_auto/vehicles/fju9rltt6g9dripejz1m.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747575113/armada_auto/vehicles/ce14e9lnkm9g5ygyfh4a.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747584559/armada_auto/vehicles/aem5r5jpbb28w3oxc', 60000, 1, 'XE0l49Z5DBaTe1zu8VOBEFlyaww1', 0, NULL, 0),
('RG440632', 'Hyundai', 'I30 ', 'suv', 'egfointihtngrt goir,grtoinrtgr oifrgrtn', 'Abidjan', 0, 1, 1, 1, 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747579459/armada_auto/vehicles/rfitkcnwl4o74opsqmal.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747579468/armada_auto/vehicles/uw8xx2j8wlborgrp5hgl.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747579479/armada_auto/vehicles/njlcjotrih1dcfnlxzbi.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747683650/armada_auto/vehicles/zxaubzeforartjj6w', 35000, 1, 'XE0l49Z5DBaTe1zu8VOBEFlyaww1', 0, 'Essence', 1),
('VU582011', 'Hyundai', 'tucson 202', 'suv', 'oifeufjefefe', 'Abidjan', 1, 1, 1, 1, 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747576112/armada_auto/vehicles/ca3em4u8otxjmxqsklek.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747576121/armada_auto/vehicles/to4p0mskdye5dvsufcvm.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747576129/armada_auto/vehicles/e4glgmriebtdiaw9f8cd.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747576139/armada_auto/vehicles/o6wuhyvceehvkkuso', 45000, 1, 'XE0l49Z5DBaTe1zu8VOBEFlyaww1', 0, NULL, 0),
('ZK841965', 'Toyota', 'fortuneraz', 'minibus', 'giontribzrbntnbrgbrgsb', 'Abidjan', 1, 0, 0, 1, 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747585028/armada_auto/vehicles/ppuxfteywhxlzovkfmsb.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747585034/armada_auto/vehicles/fqm1lzmzi1bh6m0di1yy.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747585046/armada_auto/vehicles/szf6uklkaczlnshnppb8.jpg', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747687708/armada_auto/vehicles/ihezm2otmuzzo7izndgt.jpg', 48520, 1, 'XE0l49Z5DBaTe1zu8VOBEFlyaww1', 0, 'Essence', 1);

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
('XE0l49Z5DBaTe1zu8VOBEFlyaww1', 'Smeb Edoh', 'smeb@gmail.com', 77679339, 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747510028/sflsyzuk6tjcgajif02c.png', 'Armada', 'rip52523', 'https://res.cloudinary.com/dubsfeixa/image/upload/v1747509412/kit7des8ulmst7gu8zc3.png', 'avenue balise', '0.3964928', '9.50272');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proprio` (`proprio`);

--
-- Index pour la table `owner`
--
ALTER TABLE `owner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `car`
--
ALTER TABLE `car`
  ADD CONSTRAINT `car_ibfk_1` FOREIGN KEY (`proprio`) REFERENCES `owner` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
