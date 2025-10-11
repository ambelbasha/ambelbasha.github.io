-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 04 Αυγ 2025 στις 18:09:06
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
-- Βάση δεδομένων: `sales_db`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `audit_log`
--

CREATE TABLE `audit_log` (
  `id` int(11) NOT NULL,
  `action` varchar(50) DEFAULT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_item` varchar(255) DEFAULT NULL,
  `old_quantity` int(11) DEFAULT NULL,
  `old_price` float DEFAULT NULL,
  `new_item` varchar(255) DEFAULT NULL,
  `new_quantity` int(11) DEFAULT NULL,
  `new_price` float DEFAULT NULL,
  `action_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `item` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `sales`
--

INSERT INTO `sales` (`id`, `item`, `quantity`, `price`) VALUES
(1, 'CPU', 20, 100),
(2, 'Printer', 10, 110),
(3, 'Screens', 30, 300),
(4, 'Keyboard', 50, 25),
(5, 'Mouse', 60, 15),
(6, 'Headphones', 15, 80),
(7, 'Webcam', 25, 50),
(8, 'Microphone', 12, 75),
(9, 'Graphics Card', 8, 400),
(10, 'External HDD', 20, 120),
(11, 'SSD', 40, 150),
(12, 'USB Flash Drive', 100, 10),
(13, 'Speakers', 20, 60),
(14, 'Router', 18, 80),
(15, 'Monitor Stand', 35, 45),
(16, 'Docking Station', 22, 150),
(17, 'Surge Protector', 40, 25);

--
-- Δείκτες `sales`
--
DELIMITER $$
CREATE TRIGGER `after_sales_delete` AFTER DELETE ON `sales` FOR EACH ROW BEGIN
    -- Log the deleted record in the audit_log table
    INSERT INTO audit_log (action, table_name, record_id, item, quantity, price, action_time)
    VALUES ('DELETE', 'sales', OLD.id, OLD.item, OLD.quantity, OLD.price, NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_sales_insert` AFTER INSERT ON `sales` FOR EACH ROW BEGIN
    -- Log the new record into the audit_log table
    INSERT INTO audit_log (action, table_name, record_id, item, quantity, price, action_time)
    VALUES ('INSERT', 'sales', NEW.id, NEW.item, NEW.quantity, NEW.price, NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_sales_update` AFTER UPDATE ON `sales` FOR EACH ROW BEGIN
    -- Log the update, showing old and new values in the audit_log table
    INSERT INTO audit_log (action, table_name, record_id, old_item, old_quantity, old_price, new_item, new_quantity, new_price, action_time)
    VALUES ('UPDATE', 'sales', OLD.id, OLD.item, OLD.quantity, OLD.price, NEW.item, NEW.quantity, NEW.price, NOW());
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `thresholds`
--

CREATE TABLE `thresholds` (
  `id` int(11) NOT NULL,
  `threshold_100` int(11) DEFAULT 100,
  `threshold_50` int(11) DEFAULT 50,
  `threshold_15` int(11) DEFAULT 15,
  `threshold_14` int(11) DEFAULT 14
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Άδειασμα δεδομένων του πίνακα `thresholds`
--

INSERT INTO `thresholds` (`id`, `threshold_100`, `threshold_50`, `threshold_15`, `threshold_14`) VALUES
(1, 0, 0, 0, 0);

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Ευρετήρια για πίνακα `thresholds`
--
ALTER TABLE `thresholds`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT για πίνακα `thresholds`
--
ALTER TABLE `thresholds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
