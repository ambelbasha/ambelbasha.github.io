CREATE DATABASE IF NOT EXISTS `students`;
USE `students`;

CREATE TABLE IF NOT EXISTS `details` (
  `id` int(5) NOT NULL,
  `name` varchar(15) NOT NULL,
  `surname` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `details` (`id`, `name`, `surname`) VALUES
(111, 'Jason', 'Georgiou'),
(112, 'Mary', 'Dimitrioy'),
(113, 'Giorgos', 'Karesis'),
(114, 'Giorgos', 'Karesis'),
(115, 'Amalia', 'Sapounzi'),
(116, 'Petros', 'Adamopoulos'),
(117, 'Ilir', 'Hoxha'),
(118, 'Steve', 'Papadopoulous');
