-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 30 Οκτ 2024 στις 23:00:25
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
-- Βάση δεδομένων: `flynow`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `airline_company`
--

CREATE TABLE `airline_company` (
  `air_com_id` int(11) NOT NULL,
  `comp_name` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `airline_company`
--

INSERT INTO `airline_company` (`air_com_id`, `comp_name`) VALUES
(1, 'Aegean Airlines'),
(2, 'AirFrance'),
(3, 'British Airways'),
(4, 'Lufthansa');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `flight_id` int(11) NOT NULL,
  `passenger_id` int(11) NOT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `departure_date` datetime NOT NULL DEFAULT '2024-01-01 00:00:00',
  `return_date` datetime NOT NULL DEFAULT '2024-01-01 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `bookings`
--

INSERT INTO `bookings` (`booking_id`, `flight_id`, `passenger_id`, `booking_date`, `departure_date`, `return_date`) VALUES
(68, 1, 18, '2024-10-30 21:37:46', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(69, 31, 18, '2024-10-30 21:37:46', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(70, 1, 18, '2024-10-30 21:42:30', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(71, 31, 18, '2024-10-30 21:42:30', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(72, 1, 21, '2024-10-30 21:50:50', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(73, 31, 21, '2024-10-30 21:50:50', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `flight`
--

CREATE TABLE `flight` (
  `flight_id` int(11) NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `departure_date` datetime DEFAULT NULL,
  `destination_airport` varchar(40) DEFAULT NULL,
  `departure_airport` varchar(40) DEFAULT NULL,
  `business_class` int(11) DEFAULT NULL,
  `economy_seat` int(11) DEFAULT NULL,
  `price_economy` float(6,2) DEFAULT NULL,
  `price_business` float(6,2) DEFAULT NULL,
  `air_com_id` int(11) NOT NULL,
  `selected` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `flight`
--

INSERT INTO `flight` (`flight_id`, `return_date`, `departure_date`, `destination_airport`, `departure_airport`, `business_class`, `economy_seat`, `price_economy`, `price_business`, `air_com_id`, `selected`) VALUES
(1, '2024-11-02 00:00:00', '2024-11-01 00:00:00', 'Barcelona', 'Athens', 0, 120, 150.00, 0.00, 1, 0),
(2, '2024-11-03 00:00:00', '2024-11-02 00:00:00', 'Barcelona', 'Athens', 0, 100, 155.00, 0.00, 1, 0),
(3, '2024-11-04 00:00:00', '2024-11-03 00:00:00', 'Barcelona', 'Athens', 0, 90, 100.00, 0.00, 2, 0),
(4, '2024-11-05 00:00:00', '2024-11-04 00:00:00', 'Barcelona', 'Athens', 0, 110, 120.00, 0.00, 3, 0),
(5, '2024-11-06 00:00:00', '2024-11-05 00:00:00', 'Barcelona', 'Athens', 0, 130, 95.00, 0.00, 2, 0),
(6, '2024-11-07 00:00:00', '2024-11-06 00:00:00', 'Barcelona', 'Athens', 0, 80, 180.00, 0.00, 4, 0),
(7, '2024-11-08 00:00:00', '2024-11-07 00:00:00', 'Barcelona', 'Athens', 0, 95, 130.00, 0.00, 3, 0),
(8, '2024-11-09 00:00:00', '2024-11-08 00:00:00', 'Barcelona', 'Athens', 0, 100, 160.00, 0.00, 1, 0),
(9, '2024-11-10 00:00:00', '2024-11-09 00:00:00', 'Barcelona', 'Athens', 0, 85, 110.00, 0.00, 2, 0),
(10, '2024-11-11 00:00:00', '2024-11-10 00:00:00', 'Barcelona', 'Athens', 0, 95, 145.00, 0.00, 4, 0),
(11, '2024-11-12 00:00:00', '2024-11-11 00:00:00', 'Barcelona', 'Athens', 0, 120, 135.00, 0.00, 1, 0),
(12, '2024-11-13 00:00:00', '2024-11-12 00:00:00', 'Barcelona', 'Athens', 0, 110, 155.00, 0.00, 2, 0),
(13, '2024-11-14 00:00:00', '2024-11-13 00:00:00', 'Barcelona', 'Athens', 0, 100, 120.00, 0.00, 3, 0),
(14, '2024-11-15 00:00:00', '2024-11-14 00:00:00', 'Barcelona', 'Athens', 0, 130, 125.00, 0.00, 4, 0),
(15, '2024-11-16 00:00:00', '2024-11-15 00:00:00', 'Barcelona', 'Athens', 0, 115, 140.00, 0.00, 1, 0),
(16, '2024-11-17 00:00:00', '2024-11-16 00:00:00', 'Barcelona', 'Athens', 0, 90, 95.00, 0.00, 2, 0),
(17, '2024-11-18 00:00:00', '2024-11-17 00:00:00', 'Barcelona', 'Athens', 0, 125, 160.00, 0.00, 3, 0),
(18, '2024-11-19 00:00:00', '2024-11-18 00:00:00', 'Barcelona', 'Athens', 0, 105, 150.00, 0.00, 4, 0),
(19, '2024-11-20 00:00:00', '2024-11-19 00:00:00', 'Barcelona', 'Athens', 0, 130, 170.00, 0.00, 1, 0),
(20, '2024-11-21 00:00:00', '2024-11-20 00:00:00', 'Barcelona', 'Athens', 0, 90, 90.00, 0.00, 2, 0),
(21, '2024-11-22 00:00:00', '2024-11-21 00:00:00', 'Barcelona', 'Athens', 0, 110, 130.00, 0.00, 3, 0),
(22, '2024-11-23 00:00:00', '2024-11-22 00:00:00', 'Barcelona', 'Athens', 0, 100, 160.00, 0.00, 4, 0),
(23, '2024-11-24 00:00:00', '2024-11-23 00:00:00', 'Barcelona', 'Athens', 0, 85, 125.00, 0.00, 1, 0),
(24, '2024-11-25 00:00:00', '2024-11-24 00:00:00', 'Barcelona', 'Athens', 0, 90, 110.00, 0.00, 2, 0),
(25, '2024-11-26 00:00:00', '2024-11-25 00:00:00', 'Barcelona', 'Athens', 0, 120, 145.00, 0.00, 3, 0),
(26, '2024-11-27 00:00:00', '2024-11-26 00:00:00', 'Barcelona', 'Athens', 0, 130, 160.00, 0.00, 4, 0),
(27, '2024-11-28 00:00:00', '2024-11-27 00:00:00', 'Barcelona', 'Athens', 0, 115, 135.00, 0.00, 1, 0),
(28, '2024-11-29 00:00:00', '2024-11-28 00:00:00', 'Barcelona', 'Athens', 0, 110, 150.00, 0.00, 2, 0),
(29, '2024-11-30 00:00:00', '2024-11-29 00:00:00', 'Barcelona', 'Athens', 0, 90, 100.00, 0.00, 3, 0),
(30, '2024-12-01 00:00:00', '2024-11-30 00:00:00', 'Barcelona', 'Athens', 0, 95, 115.00, 0.00, 4, 0),
(31, '2024-11-03 00:00:00', '2024-11-02 00:00:00', 'Athens', 'Barcelona', 0, 120, 150.00, 0.00, 1, 0),
(32, '2024-11-04 00:00:00', '2024-11-03 00:00:00', 'Athens', 'Barcelona', 0, 100, 155.00, 0.00, 1, 0),
(33, '2024-11-05 00:00:00', '2024-11-04 00:00:00', 'Athens', 'Barcelona', 0, 90, 100.00, 0.00, 2, 0),
(34, '2024-11-06 00:00:00', '2024-11-05 00:00:00', 'Athens', 'Barcelona', 0, 110, 120.00, 0.00, 3, 0),
(35, '2024-11-07 00:00:00', '2024-11-06 00:00:00', 'Athens', 'Barcelona', 0, 130, 95.00, 0.00, 2, 0),
(36, '2024-11-08 00:00:00', '2024-11-07 00:00:00', 'Athens', 'Barcelona', 0, 80, 180.00, 0.00, 4, 0),
(37, '2024-11-09 00:00:00', '2024-11-08 00:00:00', 'Athens', 'Barcelona', 0, 95, 130.00, 0.00, 3, 0),
(38, '2024-11-10 00:00:00', '2024-11-09 00:00:00', 'Athens', 'Barcelona', 0, 100, 160.00, 0.00, 1, 0),
(39, '2024-11-11 00:00:00', '2024-11-10 00:00:00', 'Athens', 'Barcelona', 0, 85, 110.00, 0.00, 2, 0),
(40, '2024-11-12 00:00:00', '2024-11-11 00:00:00', 'Athens', 'Barcelona', 0, 95, 145.00, 0.00, 4, 0),
(41, '2024-11-13 00:00:00', '2024-11-12 00:00:00', 'Athens', 'Barcelona', 0, 120, 135.00, 0.00, 1, 0),
(42, '2024-11-14 00:00:00', '2024-11-13 00:00:00', 'Athens', 'Barcelona', 0, 110, 155.00, 0.00, 2, 0),
(43, '2024-11-15 00:00:00', '2024-11-14 00:00:00', 'Athens', 'Barcelona', 0, 100, 120.00, 0.00, 3, 0),
(44, '2024-11-16 00:00:00', '2024-11-15 00:00:00', 'Athens', 'Barcelona', 0, 130, 125.00, 0.00, 4, 0),
(45, '2024-11-17 00:00:00', '2024-11-16 00:00:00', 'Athens', 'Barcelona', 0, 115, 140.00, 0.00, 1, 0),
(46, '2024-11-18 00:00:00', '2024-11-17 00:00:00', 'Athens', 'Barcelona', 0, 90, 95.00, 0.00, 2, 0),
(47, '2024-11-19 00:00:00', '2024-11-18 00:00:00', 'Athens', 'Barcelona', 0, 125, 160.00, 0.00, 3, 0),
(48, '2024-11-20 00:00:00', '2024-11-19 00:00:00', 'Athens', 'Barcelona', 0, 105, 150.00, 0.00, 4, 0),
(49, '2024-11-21 00:00:00', '2024-11-20 00:00:00', 'Athens', 'Barcelona', 0, 130, 170.00, 0.00, 1, 0),
(50, '2024-11-22 00:00:00', '2024-11-21 00:00:00', 'Athens', 'Barcelona', 0, 90, 90.00, 0.00, 2, 0),
(51, '2024-11-23 00:00:00', '2024-11-22 00:00:00', 'Athens', 'Barcelona', 0, 110, 130.00, 0.00, 3, 0),
(52, '2024-11-24 00:00:00', '2024-11-23 00:00:00', 'Athens', 'Barcelona', 0, 100, 160.00, 0.00, 4, 0),
(53, '2024-11-25 00:00:00', '2024-11-24 00:00:00', 'Athens', 'Barcelona', 0, 85, 125.00, 0.00, 1, 0),
(54, '2024-11-26 00:00:00', '2024-11-25 00:00:00', 'Athens', 'Barcelona', 0, 90, 110.00, 0.00, 2, 0),
(55, '2024-11-27 00:00:00', '2024-11-26 00:00:00', 'Athens', 'Barcelona', 0, 120, 145.00, 0.00, 3, 0),
(56, '2024-11-28 00:00:00', '2024-11-27 00:00:00', 'Athens', 'Barcelona', 0, 130, 160.00, 0.00, 4, 0),
(57, '2024-11-29 00:00:00', '2024-11-28 00:00:00', 'Athens', 'Barcelona', 0, 115, 135.00, 0.00, 1, 0),
(58, '2024-11-30 00:00:00', '2024-11-29 00:00:00', 'Athens', 'Barcelona', 0, 110, 150.00, 0.00, 2, 0),
(59, '2024-12-01 00:00:00', '2024-11-30 00:00:00', 'Athens', 'Barcelona', 0, 90, 100.00, 0.00, 3, 0);

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `passenger`
--

CREATE TABLE `passenger` (
  `passenger_id` int(11) NOT NULL,
  `p_name` varchar(20) DEFAULT NULL,
  `p_lastname` varchar(20) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `passenger_type` enum('Adult','Child','Infant') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `passenger`
--

INSERT INTO `passenger` (`passenger_id`, `p_name`, `p_lastname`, `city`, `user_id`, `passenger_type`) VALUES
(18, 'Ambel', 'Basha', 'Athens', 25, 'Adult'),
(19, 'Leli', 'Basha', 'Athens', 26, 'Adult'),
(20, 'Ambel', 'Basha', 'Athens', 27, 'Adult'),
(21, 'Ambel', 'Basha', 'Athens', 25, 'Child');

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `user_auth`
--

CREATE TABLE `user_auth` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `user_auth`
--

INSERT INTO `user_auth` (`user_id`, `username`, `password`, `email`, `created_at`) VALUES
(25, 'ambelbasha2024', '$2y$10$c1pfCQIviyt/fjT0M2JG2enxGUAAzdqYgFGbi9qXH1GJFTTsmuI9G', 'ambelbasha@gmail.com', '2024-10-29 23:40:58'),
(26, 'ambelbasha2420', '$2y$10$U.156Fawsy.C4KPZGPiEjeQ0wqWqDRz4AvpnPtPleKTxGTYwbKpc6', 'cs121105@uniwa.gr', '2024-10-29 23:49:29'),
(27, 'ambelbashaUltimate', '$2y$10$F/WXKmZl0WVr1abW3AeqJembuElWNjB0tnmo7uX0Om1UZG2qiiCCW', 'ambelbasha@hotmail.com', '2024-10-30 00:09:48');

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `airline_company`
--
ALTER TABLE `airline_company`
  ADD PRIMARY KEY (`air_com_id`),
  ADD UNIQUE KEY `comp_name` (`comp_name`);

--
-- Ευρετήρια για πίνακα `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`);

--
-- Ευρετήρια για πίνακα `flight`
--
ALTER TABLE `flight`
  ADD PRIMARY KEY (`flight_id`),
  ADD KEY `air_com_id` (`air_com_id`);

--
-- Ευρετήρια για πίνακα `passenger`
--
ALTER TABLE `passenger`
  ADD PRIMARY KEY (`passenger_id`),
  ADD KEY `passenger_user_fk` (`user_id`);

--
-- Ευρετήρια για πίνακα `user_auth`
--
ALTER TABLE `user_auth`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `airline_company`
--
ALTER TABLE `airline_company`
  MODIFY `air_com_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT για πίνακα `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT για πίνακα `flight`
--
ALTER TABLE `flight`
  MODIFY `flight_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT για πίνακα `passenger`
--
ALTER TABLE `passenger`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT για πίνακα `user_auth`
--
ALTER TABLE `user_auth`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `flight`
--
ALTER TABLE `flight`
  ADD CONSTRAINT `flight_ibfk_1` FOREIGN KEY (`air_com_id`) REFERENCES `airline_company` (`air_com_id`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `passenger`
--
ALTER TABLE `passenger`
  ADD CONSTRAINT `passenger_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_auth` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
