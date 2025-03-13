#DROP DATABASE nombreBD;

#CREATE DATABASE GeekMedia;

USE GeekMedia;

CREATE TABLE clients(
	id INT AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(12) UNIQUE NOT NULL,
    `name` VARCHAR(30) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    phone INT NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE clients ADD COLUMN isAdmin BOOLEAN NOT NULL DEFAULT 0;

CREATE TABLE sales(
	id INT AUTO_INCREMENT,
    fk_id_client INT NOT NULL,
    fk_id_product VARCHAR(30) NOT NULL,
	`type` VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (fk_id_client) REFERENCES clients (id)
);