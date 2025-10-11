-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 09 Δεκ 2024 στις 23:49:58
-- Έκδοση διακομιστή: 10.4.32-MariaDB
-- Έκδοση PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `sales_db`

-- --------------------------------------------------------

-- Create Table: `audit_log`
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

-- Create Table: `sales`
CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `item` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert Data into `sales`
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

-- Create Trigger: `after_sales_delete`
DELIMITER $$
CREATE TRIGGER `after_sales_delete` AFTER DELETE ON `sales` FOR EACH ROW BEGIN
    -- Log the deleted record in the audit_log table
    INSERT INTO audit_log (action, table_name, record_id, old_item, old_quantity, old_price, action_time)
    VALUES ('DELETE', 'sales', OLD.id, OLD.item, OLD.quantity, OLD.price, NOW());
END
$$
DELIMITER ;

-- Create Trigger: `after_sales_insert`
DELIMITER $$
CREATE TRIGGER `after_sales_insert` AFTER INSERT ON `sales` FOR EACH ROW BEGIN
    -- Log the new record into the audit_log table
    INSERT INTO audit_log (action, table_name, record_id, new_item, new_quantity, new_price, action_time)
    VALUES ('INSERT', 'sales', NEW.id, NEW.item, NEW.quantity, NEW.price, NOW());
END
$$
DELIMITER ;

-- Create Trigger: `after_sales_update`
DELIMITER $$
CREATE TRIGGER `after_sales_update` AFTER UPDATE ON `sales` FOR EACH ROW BEGIN
    -- Log the update, showing old and new values in the audit_log table
    INSERT INTO audit_log (action, table_name, record_id, old_item, old_quantity, old_price, new_item, new_quantity, new_price, action_time)
    VALUES ('UPDATE', 'sales', OLD.id, OLD.item, OLD.quantity, OLD.price, NEW.item, NEW.quantity, NEW.price, NOW());
END
$$
DELIMITER ;

-- Add Primary Key: `audit_log`
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`);

-- Add Primary Key: `sales`
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

-- Modify Auto Increment for `audit_log`
ALTER TABLE `audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

-- Modify Auto Increment for `sales`
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
