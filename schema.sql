-- Employee Management System DB
drop database if exists ems_db;
create database ems_db;
use ems_db;

create table departments (
    id int not null auto_increment primary key,
    department_name varchar(30)

);

create table roles (
    id int not null primary key auto_increment,
    title varchar(30) not null,
    salary decimal not null,
    department_id int,
    foreign key (department_id)
    references departments(id)
);
-- MAYBE add an ismanager boolean
create table employee (
    id int primary key auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    manager_id int,
    foreign key (role_id)
    references roles(id)
);

