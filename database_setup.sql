create database appdb;
create user userEHX;
grant all privileges on appdb.* TO 'userEHX'@'%' identified by 'DB_PASS';
flush privileges;
use appdb;
CREATE TABLE tasks ( id INT NOT NULL AUTO_INCREMENT primary key NOT NULL, text VARCHAR(100) NOT NULL, day VARCHAR(100) NOT NULL, reminder boolean not null default 1, attr LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL, CHECK (JSON_VALID(`attr`)) );
alter table tasks add column completed boolean not null default 0;
ALTER TABLE tasks ADD COLUMN file_path varchar(60);
ALTER TABLE tasks ADD COLUMN time FLOAT not null default 0.0;

