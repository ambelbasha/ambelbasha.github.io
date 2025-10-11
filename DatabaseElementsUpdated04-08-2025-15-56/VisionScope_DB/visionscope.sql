-- Create the database
CREATE DATABASE `visionscope`;

-- Use the database
USE `visionscope`;

-- Create table logs
CREATE TABLE `logs` (
  `logId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `loginDate` date NOT NULL DEFAULT curdate(),
  `registerDate` date DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `logoutTime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create table storedurls
CREATE TABLE `storedurls` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `url` text NOT NULL,
  `name` varchar(255) NOT NULL,
  `initiallyStored` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create table usersaccount
CREATE TABLE `usersaccount` (
  `userid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `modificationDate` date DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `registrationDate` date NOT NULL DEFAULT curdate(),
  `profileImage` varchar(255) DEFAULT '',
  `profileImagePath` varchar(255) DEFAULT '',
  `profileImageExtension` varchar(10) DEFAULT '',
  `adminRole` tinyint(1) NOT NULL DEFAULT 0,
  `loginDate` datetime DEFAULT NULL,
  `activationToken` varchar(255) DEFAULT NULL,
  `expiry` datetime DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
