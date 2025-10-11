-- Insert into logs table
INSERT INTO `logs` (`logId`, `userId`, `username`, `loginDate`, `registerDate`, `action`, `logoutTime`) VALUES
(1, 1, 'ambelbasha', '2025-02-22', '2025-02-22', '', '2025-04-20 20:45:55'),
(2, 2, 'admin', '2025-02-22', '2025-04-21', 'Logout', '2025-04-21 06:57:02'),
(4, 1, 'System', '2025-03-21', '2025-03-21', '', '2025-04-20 20:45:55');

-- Insert into storedurls table
INSERT INTO `storedurls` (`id`, `userId`, `url`, `name`, `initiallyStored`, `updated`) VALUES
(793, 1, 'https://www.youtube.com/live/LtzkkAeW_Qg?si=wtSCmkYelX1anOyp', 'Camera 1', '2025-03-23 19:59:04', '2025-03-25 16:45:50'),
(867, 1, 'https://www.youtube.com/live/jc2oQUQeaRI?si=UkMvTcA6ukrI0CdK', 'Live', '2025-03-25 18:09:53', '2025-03-25 20:10:31'),
(1085, 46, 'https://www.youtube.com/live/qtsseQlQAQU?si=bP1CqI7QjAgjRkzH', 'New Camera Nr 1', '2025-04-03 13:58:34', '2025-04-03 13:58:34'),
(1086, 46, 'https://www.youtube.com/live/qtsseQlQAQU?si=bP1CqI7QjAgjRkzH', 'New Camera Nr 0', '2025-04-03 13:58:46', '2025-04-03 13:58:46'),
(1087, 46, 'https://www.youtube.com/live/IAkRcsPDO8w?si=SiTusx-kql1G4cYp', 'New Camera Nr 1', '2025-04-03 13:58:52', '2025-04-03 13:58:52');

-- Insert into usersaccount table
INSERT INTO `usersaccount` (`userid`, `username`, `email`, `modificationDate`, `password`, `isActive`, `registrationDate`, `profileImage`, `profileImagePath`, `profileImageExtension`, `adminRole`, `loginDate`, `activationToken`, `expiry`, `lastLogin`) VALUES
(1, 'ambelbasha', 'ambelbasha@gmail.com', '2025-02-22', '$2a$10$/64GMyylIXqrFlRJiuLl1eM5NqqQdQ1GjWi.q7IwAWcBI/bK13F.6', 1, '2025-04-03', 'profile.jpg', '/Images/ambelbasha/profile.jpg', NULL, 0, NULL, NULL, NULL, NULL),
(2, 'admin', 'ambelbasha@hotmail.com', '2025-02-22', '$2a$10$Zf4XuR239bKZrlMWzX4xfu4HG.gDTVS0gxAxhZi4DP7gEm9hFWlLi', 1, '2025-04-03', 'profile.jpg', '/Images/admin/profile.jpg', NULL, 1, NULL, NULL, NULL, NULL),
(44, 'evermadder', 'evermadder@yahoo.com', '2025-04-03', '$2a$10$IoO/a/63haVURRKEkmlya.J7uZIumt/2iR1GKfIi64PGRbCdOqCDS', 1, '2025-04-03', 'profile.png', '/Images/evermadder/profile.png', NULL, 0, NULL, NULL, NULL, NULL);
