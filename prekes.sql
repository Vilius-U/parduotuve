-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jun 10, 2024 at 07:42 PM
-- Server version: 5.7.44
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `instalika`
--

-- --------------------------------------------------------

--
-- Table structure for table `isimintos`
--

CREATE TABLE `isimintos` (
  `preke_id` int(11) NOT NULL,
  `vartotojas_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `prekes`
--

CREATE TABLE `prekes` (
  `SKU` varchar(255) NOT NULL,
  `TITLE` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `CATEGORY` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `SHORT_DESCRIPTION` text CHARACTER SET utf8,
  `DESCRIPTION` text CHARACTER SET utf8,
  `PRICE` decimal(10,2) DEFAULT NULL,
  `QTY` varchar(255) DEFAULT NULL,
  `IMAGE` varchar(255) DEFAULT NULL,
  `MANUFACTURER` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `WEIGHT` varchar(255) DEFAULT NULL,
  `EAN` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `sukurimo_data` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transakcijos`
--

CREATE TABLE `transakcijos` (
  `id` int(11) NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `buyer_id` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `items` varchar(10000) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `payed` tinyint(1) NOT NULL DEFAULT '0',
  `delivered` tinyint(1) NOT NULL DEFAULT '0',
  `code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `vartotojai`
--

CREATE TABLE `vartotojai` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `surname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `activation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `isimintos`
--
ALTER TABLE `isimintos`
  ADD KEY `preke_id` (`preke_id`),
  ADD KEY `vartotojas_id` (`vartotojas_id`);

--
-- Indexes for table `prekes`
--
ALTER TABLE `prekes`
  ADD PRIMARY KEY (`id`);
ALTER TABLE `prekes` ADD FULLTEXT KEY `fulltext_index` (`TITLE`,`SHORT_DESCRIPTION`,`DESCRIPTION`,`MANUFACTURER`);

--
-- Indexes for table `transakcijos`
--
ALTER TABLE `transakcijos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `vartotojai`
--
ALTER TABLE `vartotojai`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`,`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `id_2` (`id`,`email`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `prekes`
--
ALTER TABLE `prekes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transakcijos`
--
ALTER TABLE `transakcijos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vartotojai`
--
ALTER TABLE `vartotojai`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `isimintos`
--
ALTER TABLE `isimintos`
  ADD CONSTRAINT `isimintos_ibfk_1` FOREIGN KEY (`preke_id`) REFERENCES `prekes` (`id`),
  ADD CONSTRAINT `isimintos_ibfk_2` FOREIGN KEY (`vartotojas_id`) REFERENCES `vartotojai` (`id`);

--
-- Constraints for table `transakcijos`
--
ALTER TABLE `transakcijos`
  ADD CONSTRAINT `transakcijos_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `vartotojai` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
