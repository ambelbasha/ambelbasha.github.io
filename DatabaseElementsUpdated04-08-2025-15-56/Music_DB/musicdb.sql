-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 06 Σεπ 2024 στις 17:58:10
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Βάση δεδομένων: `musicdb`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `music`
--

CREATE TABLE `music` (
  `songno` int(11) NOT NULL,
  `genres` varchar(255) DEFAULT NULL,
  `artist` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `userid` int(11) NOT NULL,
  `moddate` date DEFAULT NULL,
  `Recording Company` varchar(255) DEFAULT NULL,
  `record_date` date DEFAULT NULL,
  `song` varchar(255) NOT NULL,
  `spotify_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `music`
--



-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `regdate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `users`
--

INSERT INTO `users` (`userid`, `name`, `surname`, `username`, `password`, `regdate`) VALUES
(1, 'Ambel', 'Basha', 'ambelbasha@gmail.com', '$2y$10$02tuSVbPA6esS48toOcWve1PPB/Bmzx6YfA0gNJFTkVagNEfy1yim', '2024-05-17'),
(2, '@ambelbasha', 'None', 'ambelbasha@hotmail.com', '$2y$10$LVYSKnRd1IfpsI0UlvD3qO2Wvr/mOGZEH1Hj79obmmLdMl2C6YUm2', '2024-05-17'),
(3, 'John', 'Doe', 'johndoe@example.com', 'plaintextpassword', '2024-05-18'),
(4, 'Ambel', 'Basha', 'evernadder@yahoo.com', '$2y$10$Tb2AH8slZftdSowrejFAt.rwMGTcUpW74Re5Qo5ABS67yhyxK5p8a', '2024-05-18'),
(5, 'Ambel', 'User3', 'cs121105@uniwa.gr', '$2y$10$.ZByekqSlO2aRLram9kd6elcMRTLqug1JDV6gIWEv0WBEVJuWWJxK', '2024-05-20'),
(6, 'Giorgios', 'Tzoul', 'giorgos99j@gmail.com', '$2y$10$C7qkID8POkmDMWsQ3ZXE9.zbY7jbEyV8IK.9yoraBCWpw09TaDUWi', '2024-05-20');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `music`
--
ALTER TABLE `music`
  ADD PRIMARY KEY (`songno`),
  ADD KEY `fk_music_userid` (`userid`),
  ADD KEY `idx_genres` (`genres`);

--
-- Ευρετήρια για πίνακα `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `music`
--
ALTER TABLE `music`
  MODIFY `songno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT για πίνακα `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `music`
--
ALTER TABLE `music`
  ADD CONSTRAINT `fk_music_userid` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
