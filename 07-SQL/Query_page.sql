use sakila;

-- Display the first and last names of all actors from the table actor
SELECT 
    first_name, last_name
FROM
    actor;

-- Display the first and last name of each actor in a single column
-- in upper case letters. Name the column Actor Name
SELECT 
    CONCAT(UPPER(first_name), ' ', UPPER(last_name)) AS `Actor Name`
FROM
    actor
LIMIT 5;

-- Comparison operator is case insensitive in MySQL
-- So name = 'Joe' will be same as name = 'joe'
-- https://stackoverflow.com/questions/3936967/mysql-case-insensitive-select
-- You need to find the ID number, first name, and last name of an actor,
-- of whom you know only the first name, "Joe." What is one query would
-- you use to obtain this information?
SELECT 
    actor_id, first_name, last_name
FROM
    actor
WHERE
    first_name = 'Joe';

-- Use regular expression to find all the names that may use
-- characters g or e or n
SELECT 
    actor_id, first_name, last_name
FROM
    actor
WHERE
    last_name REGEXP '.*gen.*';

-- Find all actors whose last names contain the letters LI . This time,
-- order the rows by last name and first name, in that order:
SELECT 
    actor_id, first_name, last_name
FROM
    actor
WHERE
    last_name REGEXP '.*li.*'
ORDER BY last_name , first_name;

-- Using IN, display the country_id and country columns
-- of the following countries: Afghanistan, Bangladesh, and China:
SELECT 
    country_id, country
FROM
    country
WHERE
    country IN ('Afghanistan' , 'Bangladesh', 'China');

-- You want to keep a description of each actor. You don't
-- think you will be performing queries on a description, so
-- create a column in the table actor named description and use
-- the data type BLOB (Make sure to research the type BLOB , as
-- the difference between it and VARCHAR are significant).
ALTER TABLE `sakila`.`actor` 
ADD COLUMN `description` BLOB NULL AFTER `last_update`;

-- Very quickly you realize that entering descriptions for
-- each actor is too much effort. Delete the description column.
ALTER TABLE `sakila`.`actor` 
drop COLUMN `description`;

-- List the last names of actors, as well as how many actors have that last name
SELECT 
    last_name AS `Actor LastName`, COUNT(*) AS `Total Actors`
FROM
    actor
GROUP BY last_name;

-- List last names of actors and the number of actors who have
-- that last name, but only for names that are shared by at least two actors
SELECT 
    last_name AS `Actor LastName`, COUNT(*) AS `Total Actors`
FROM
    actor
GROUP BY last_name
HAVING `Total Actors` > 1;

-- The actor HARPO WILLIAMS was accidentally entered in the
-- actor table as GROUCHO WILLIAMS . Write a query to fix the record.
-- Following extra statements were done to understand the behavior
-- even though they are not required for the homework
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    first_name = 'GROUCHO'
        AND last_name = 'WILLIAMS';
UPDATE actor 
SET 
    first_name = 'HARPO'
WHERE
    first_name = 'GROUCHO'
        AND last_name = 'WILLIAMS';
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    first_name = 'HARPO'
        AND last_name = 'WILLIAMS';
UPDATE actor 
SET 
    first_name = UPPER('HARPO')
WHERE
    first_name = 'HARPO'
        AND last_name = 'WILLIAMS';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO .
-- It turns out that GROUCHO was the correct name after all!
-- In a single query, if the first name of the actor is currently HARPO,
-- change it to GROUCHO
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    first_name = 'HARPO'
        AND last_name = 'WILLIAMS';
UPDATE actor 
SET 
    first_name = 'GROUCHO'
WHERE
    first_name = 'HARPO'
        AND last_name = 'WILLIAMS';
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    first_name = 'GROUCHO'
        AND last_name = 'WILLIAMS';

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
show create table address;
# Table, Create Table
-- CREATE TABLE `address` (
--   `address_id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
--   `address` varchar(50) NOT NULL,
--   `address2` varchar(50) DEFAULT NULL,
--   `district` varchar(20) NOT NULL,
--   `city_id` smallint(5) unsigned NOT NULL,
--   `postal_code` varchar(10) DEFAULT NULL,
--   `phone` varchar(20) NOT NULL,
--   `location` geometry NOT NULL,
--   `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   PRIMARY KEY (`address_id`),
--   KEY `idx_fk_city_id` (`city_id`),
--   SPATIAL KEY `idx_location` (`location`),
--   CONSTRAINT `fk_address_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`) ON UPDATE CASCADE
-- ) ENGINE=InnoDB AUTO_INCREMENT=606 DEFAULT CHARSET=utf8

-- 6a. Use JOIN to display the first and last names, as well as the address,
-- of each staff member. Use the tables staff and address :
