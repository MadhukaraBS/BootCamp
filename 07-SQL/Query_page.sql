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
