-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Εξυπηρετητής: 127.0.0.1
-- Χρόνος δημιουργίας: 24 Φεβ 2025 στις 00:30:23
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
-- Βάση δεδομένων: `loopeye`
--

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `cameraactionslog`
--

CREATE TABLE `cameraactionslog` (
  `logId` int(11) NOT NULL,
  `cameraId` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `adminId` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `camerafirmwareupdates`
--

CREATE TABLE `camerafirmwareupdates` (
  `updateId` bigint(20) UNSIGNED NOT NULL,
  `cameraId` bigint(20) UNSIGNED NOT NULL,
  `previousVersion` varchar(50) NOT NULL,
  `newVersion` varchar(50) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedByAdminId` bigint(20) UNSIGNED DEFAULT NULL,
  `updatedByUserId` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `cameramaintenancelogs`
--

CREATE TABLE `cameramaintenancelogs` (
  `logId` int(11) NOT NULL,
  `cameraId` bigint(20) UNSIGNED NOT NULL,
  `adminId` bigint(20) UNSIGNED NOT NULL,
  `maintenanceAction` enum('diagnosis','repair','configuration') NOT NULL,
  `details` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `cameras`
--

CREATE TABLE `cameras` (
  `cameraId` bigint(20) UNSIGNED NOT NULL,
  `cameraName` varchar(100) NOT NULL,
  `cameraType` enum('PTZ','Fixed','Thermal','Bullet') NOT NULL,
  `status` enum('active','inactive','maintenance') DEFAULT 'active',
  `streamingURL` varchar(255) DEFAULT NULL,
  `firmwareVersion` varchar(50) DEFAULT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `initialLocation` varchar(255) NOT NULL,
  `secondaryLocation` varchar(255) NOT NULL,
  `currentLocation` enum('initial','secondary') DEFAULT 'initial',
  `storageLimit` bigint(20) NOT NULL CHECK (`storageLimit` > 0),
  `timeLimit` int(11) DEFAULT 365 CHECK (`timeLimit` > 0),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `camerasettings`
--

CREATE TABLE `camerasettings` (
  `cameraId` bigint(20) UNSIGNED NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `settingsJson` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settingsJson`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `globalnotifications`
--

CREATE TABLE `globalnotifications` (
  `notificationId` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `message` text NOT NULL,
  `severity` enum('info','warning','critical') NOT NULL,
  `resolved` tinyint(1) DEFAULT 0,
  `resolvedAt` timestamp NULL DEFAULT NULL,
  `adminId` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `logdata`
--

CREATE TABLE `logdata` (
  `logId` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` bigint(20) UNSIGNED NOT NULL,
  `eventType` enum('info','warning','error') NOT NULL,
  `details` text NOT NULL,
  `adminResolved` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `recordedfootage`
--

CREATE TABLE `recordedfootage` (
  `footageId` int(11) NOT NULL,
  `cameraId` bigint(20) UNSIGNED NOT NULL,
  `filePath` varchar(255) NOT NULL,
  `fileSize` bigint(20) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `remoteassistancelogs`
--

CREATE TABLE `remoteassistancelogs` (
  `logId` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `userId` bigint(20) UNSIGNED NOT NULL,
  `adminId` bigint(20) UNSIGNED NOT NULL,
  `activityType` enum('assist','troubleshoot','setup') NOT NULL,
  `details` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `useraccounts`
--

CREATE TABLE `useraccounts` (
  `userId` bigint(20) UNSIGNED NOT NULL,
  `userName` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`permissions`)),
  `isAdmin` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','suspended','deactivated') DEFAULT 'active',
  `themePreference` enum('light','dark') DEFAULT 'light',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `lastLogin` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Δομή πίνακα για τον πίνακα `usercameraoverview`
--

CREATE TABLE `usercameraoverview` (
  `overviewId` int(11) NOT NULL,
  `userId` bigint(20) UNSIGNED NOT NULL,
  `totalCameras` int(11) DEFAULT 0,
  `activeCameras` int(11) DEFAULT 0,
  `inactiveCameras` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Ευρετήρια για άχρηστους πίνακες
--

--
-- Ευρετήρια για πίνακα `cameraactionslog`
--
ALTER TABLE `cameraactionslog`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `idx_cameraActionsLog_cameraId` (`cameraId`),
  ADD KEY `idx_cameraActionsLog_adminId` (`adminId`);

--
-- Ευρετήρια για πίνακα `camerafirmwareupdates`
--
ALTER TABLE `camerafirmwareupdates`
  ADD PRIMARY KEY (`updateId`),
  ADD KEY `cameraId` (`cameraId`),
  ADD KEY `fk_cameraFirmwareUpdates_adminId` (`updatedByAdminId`),
  ADD KEY `fk_cameraFirmwareUpdates_userId` (`updatedByUserId`);

--
-- Ευρετήρια για πίνακα `cameramaintenancelogs`
--
ALTER TABLE `cameramaintenancelogs`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `idx_cameraMaintenanceLogs_cameraId` (`cameraId`),
  ADD KEY `fk_cameraMaintenanceLogs_adminId` (`adminId`);

--
-- Ευρετήρια για πίνακα `cameras`
--
ALTER TABLE `cameras`
  ADD PRIMARY KEY (`cameraId`),
  ADD KEY `userId` (`userId`);

--
-- Ευρετήρια για πίνακα `camerasettings`
--
ALTER TABLE `camerasettings`
  ADD PRIMARY KEY (`cameraId`),
  ADD KEY `userId` (`userId`);

--
-- Ευρετήρια για πίνακα `globalnotifications`
--
ALTER TABLE `globalnotifications`
  ADD PRIMARY KEY (`notificationId`),
  ADD KEY `idx_globalNotifications_severity` (`severity`),
  ADD KEY `fk_globalNotifications_adminId` (`adminId`);

--
-- Ευρετήρια για πίνακα `logdata`
--
ALTER TABLE `logdata`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `idx_logData_userId` (`userId`);

--
-- Ευρετήρια για πίνακα `recordedfootage`
--
ALTER TABLE `recordedfootage`
  ADD PRIMARY KEY (`footageId`),
  ADD KEY `idx_recordedFootage_cameraId` (`cameraId`);

--
-- Ευρετήρια για πίνακα `remoteassistancelogs`
--
ALTER TABLE `remoteassistancelogs`
  ADD PRIMARY KEY (`logId`),
  ADD KEY `idx_remoteAssistanceLogs_userId` (`userId`),
  ADD KEY `idx_remoteAssistanceLogs_adminId` (`adminId`);

--
-- Ευρετήρια για πίνακα `useraccounts`
--
ALTER TABLE `useraccounts`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `userName` (`userName`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Ευρετήρια για πίνακα `usercameraoverview`
--
ALTER TABLE `usercameraoverview`
  ADD PRIMARY KEY (`overviewId`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT για άχρηστους πίνακες
--

--
-- AUTO_INCREMENT για πίνακα `cameraactionslog`
--
ALTER TABLE `cameraactionslog`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `camerafirmwareupdates`
--
ALTER TABLE `camerafirmwareupdates`
  MODIFY `updateId` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `cameramaintenancelogs`
--
ALTER TABLE `cameramaintenancelogs`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `cameras`
--
ALTER TABLE `cameras`
  MODIFY `cameraId` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `globalnotifications`
--
ALTER TABLE `globalnotifications`
  MODIFY `notificationId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `logdata`
--
ALTER TABLE `logdata`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `recordedfootage`
--
ALTER TABLE `recordedfootage`
  MODIFY `footageId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `remoteassistancelogs`
--
ALTER TABLE `remoteassistancelogs`
  MODIFY `logId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `useraccounts`
--
ALTER TABLE `useraccounts`
  MODIFY `userId` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT για πίνακα `usercameraoverview`
--
ALTER TABLE `usercameraoverview`
  MODIFY `overviewId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Περιορισμοί για άχρηστους πίνακες
--

--
-- Περιορισμοί για πίνακα `cameraactionslog`
--
ALTER TABLE `cameraactionslog`
  ADD CONSTRAINT `fk_cameraActionsLog_adminId` FOREIGN KEY (`adminId`) REFERENCES `useraccounts` (`userId`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cameraActionsLog_cameraId` FOREIGN KEY (`cameraId`) REFERENCES `cameras` (`cameraId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `camerafirmwareupdates`
--
ALTER TABLE `camerafirmwareupdates`
  ADD CONSTRAINT `fk_cameraFirmwareUpdates_adminId` FOREIGN KEY (`updatedByAdminId`) REFERENCES `useraccounts` (`userId`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cameraFirmwareUpdates_cameraId` FOREIGN KEY (`cameraId`) REFERENCES `cameras` (`cameraId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cameraFirmwareUpdates_userId` FOREIGN KEY (`updatedByUserId`) REFERENCES `useraccounts` (`userId`) ON DELETE SET NULL;

--
-- Περιορισμοί για πίνακα `cameramaintenancelogs`
--
ALTER TABLE `cameramaintenancelogs`
  ADD CONSTRAINT `fk_cameraMaintenanceLogs_adminId` FOREIGN KEY (`adminId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cameraMaintenanceLogs_cameraId` FOREIGN KEY (`cameraId`) REFERENCES `cameras` (`cameraId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `cameras`
--
ALTER TABLE `cameras`
  ADD CONSTRAINT `fk_cameras_userId` FOREIGN KEY (`userId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `camerasettings`
--
ALTER TABLE `camerasettings`
  ADD CONSTRAINT `camerasettings_ibfk_1` FOREIGN KEY (`cameraId`) REFERENCES `cameras` (`cameraId`) ON DELETE CASCADE,
  ADD CONSTRAINT `camerasettings_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `globalnotifications`
--
ALTER TABLE `globalnotifications`
  ADD CONSTRAINT `fk_globalNotifications_adminId` FOREIGN KEY (`adminId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `logdata`
--
ALTER TABLE `logdata`
  ADD CONSTRAINT `fk_logData_userId` FOREIGN KEY (`userId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `recordedfootage`
--
ALTER TABLE `recordedfootage`
  ADD CONSTRAINT `fk_recordedFootage_cameraId` FOREIGN KEY (`cameraId`) REFERENCES `cameras` (`cameraId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `remoteassistancelogs`
--
ALTER TABLE `remoteassistancelogs`
  ADD CONSTRAINT `fk_remoteAssistanceLogs_adminId` FOREIGN KEY (`adminId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_remoteAssistanceLogs_userId` FOREIGN KEY (`userId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE;

--
-- Περιορισμοί για πίνακα `usercameraoverview`
--
ALTER TABLE `usercameraoverview`
  ADD CONSTRAINT `usercameraoverview_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `useraccounts` (`userId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
