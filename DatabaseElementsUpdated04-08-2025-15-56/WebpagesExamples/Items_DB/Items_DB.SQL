-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `items`;

-- Switch to using the `items` database
USE `items`;

-- Create the table `items_value`
CREATE TABLE IF NOT EXISTS `items_value` (
  `items_name` varchar(20) NOT NULL,
  `items_price` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Insert data into the `items_value` table
INSERT INTO `items_value` (`items_name`, `items_price`) VALUES
('chair', 40),
('sofa', 300),
('lamp', 28),
('desk', 100),
('table', 75),
('library', 130);
