DROP DATABASE IF EXISTS employeelist;
CREATE DATABASE employeelist;
USE employeelist;

CREATE TABLE departments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    depname VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(6, 2) NOT NULL,
    department_id INTEGER
);

CREATE TABLE employees(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);
