-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 04 Αυγ 2025 στις 14:55:51
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `projects_db`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Άδειασμα δεδομένων του πίνακα `projects`
--

INSERT INTO `projects` (`id`, `title`, `description`, `url`) VALUES
(1, 'Music Database', 'This is a music database website', '/WebPages/MyWebSites/Websites/Music_DB_Html/index.html'),
(2, 'CCTV Home Surveillance', 'This is for CCTV', '/CCTVRaspberryPi28062024-1.0-SNAPSHOT/login.jsp'),
(3, 'Vision Scope', 'Vision Scope', '/VisionScope-1.0-SNAPSHOT/login.jsp'),
(4, 'Flynow New Project', 'A new Concept of FlyNow', '/WebPages/MyWebSites/Websites/Flynow_New/index.php'),
(5, 'Students File Project', 'File Students project', '/WebPages/MyWebSites/Websites/Amazing/index.html'),
(6, 'Favorite Movies', 'Sample of Favorite Movies', '/WebPages/MyWebSites/Websites/Beloved_Movies/index.html'),
(7, 'Html & PHP Examples', 'Examples', '/WebPages/MyWebSites/Websites/WebpageExamples/index.html');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
