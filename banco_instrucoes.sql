CREATE DATABASE IF NOT EXISTS nodemysql;
USE nodemysql;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE,
  `occupation` VARCHAR(150),
  `newsletter` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Índice para name
ALTER TABLE `users` ADD INDEX `users_name` (`name`);

-- Mostrar índices
SHOW INDEX FROM `users`;

-- Tabela de endereços
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` INT AUTO_INCREMENT,
  `street` VARCHAR(200) NOT NULL,
  `number` VARCHAR(20),
  `city` VARCHAR(100) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  `userId` INT,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_addresses_user`
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Mostrar índices
SHOW INDEX FROM `addresses`;