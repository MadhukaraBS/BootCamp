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
SELECT 
    first_name, last_name, address
FROM
    staff
        JOIN
    address USING (address_id);

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use
-- tables staff and payment .
SELECT 
    staff_id, first_name, last_name, SUM(amount)
FROM
    staff s
        JOIN
    payment p USING (staff_id)
WHERE
    DATE(payment_date) > '2005-07-31'
        AND DATE(payment_date) < '2005-09-01'
GROUP BY staff_id;

-- select count(*) from staff;
-- select customer_id, staff_id from payment;
-- select customer_id, staff_id, payment_date from payment where DATE(payment_date) > '2005-07-31' and DATE(payment_date) < '2005-09-01';
-- select staff_id, count(*) from payment group by staff_id;

SELECT 
    title, COUNT(*) AS `Number of Actors`
FROM
    film f
        INNER JOIN
    film_actor fa USING (film_id)
GROUP BY title;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT 
    title, COUNT(*) AS `Total records`
FROM
    film f
        INNER JOIN
    inventory i ON f.film_id = i.film_id
WHERE
    f.title = 'Hunchback Impossible'
GROUP BY title;

-- 6e. Using the tables payment and customer and the
-- JOIN command, list the total paid by each customer. List
-- the customers alphabetically by last name:
SELECT 
    c.first_name, c.last_name, SUM(p.amount) AS `Total amount`
FROM
    payment p
        INNER JOIN
    customer c ON p.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY c.last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an
-- unlikely resurgence. As an unintended consequence, films
-- starting with the letters K and Q have also soared in
-- popularity. Use subqueries to display the titles of movies
-- starting with the letters K and Q whose language is English.
SELECT 
    title, l.language_id, l.name
FROM
    film f
        JOIN
    language l ON f.language_id = l.language_id
        AND l.name = 'English'
        AND title REGEXP '^[KQ].*';

SELECT 
    title
FROM
    film
WHERE
    title REGEXP '^[KQ].*'
        AND language_id IN (SELECT 
            language_id
        FROM
            language
        WHERE
            name = 'English');

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip .
SELECT 
    first_name, last_name
FROM
    actor
WHERE
    actor_id IN (SELECT 
            actor_id
        FROM
            film_actor
        WHERE
            film_id IN (SELECT 
                    film_id
                FROM
                    film
                WHERE
                    title = 'Alone Trip'));

-- Individual queries
-- SELECT 
--     film_id
-- FROM
--     film
-- WHERE
--     title = 'Alone Trip';
-- SELECT 
--     actor_id
-- FROM
--     film_actor
-- WHERE
--     film_id = 17;
-- SELECT 
--     first_name, last_name
-- FROM
--     actor
-- WHERE
--     actor_id IN (3 , 12, 13, 82, 100, 160, 167, 187);

SELECT 
    first_name, last_name, email, city, country
FROM
    customer cu
        INNER JOIN
    address ad USING (address_id)
        INNER JOIN
    city ct USING (city_id)
        INNER JOIN
    country co USING (country_id)
WHERE
    co.country = 'Canada';

-- 7d. Sales have been lagging among young families, and you
-- wish to target all family movies for a promotion.  Identify
-- all movies categorized as family films.
SELECT 
    title AS `Movie Title`, ct.name
FROM
    film f
        INNER JOIN
    film_category fc USING (film_id)
        INNER JOIN
    category ct USING (category_id)
WHERE
    ct.name = 'Family';

-- 7e. Display the most frequently rented movies in descending order.
-- First inner join rental and inventory tables on key inventory_id
-- Then group by film_id. This will remove inventory_id and use film_id
-- to count total number of rentals
-- Then order descending by rental count
-- select group_concat(rental_id), (select title from film f2 where f2.film_id = i.film_id) as `Movie title`, count(rental_id) from inventory i
-- inner join rental r using(inventory_id)
-- group by film_id
-- order by count(rental_id) desc;
select (select title from film f2 where f2.film_id = i.film_id) as `Movie title` from inventory i
inner join rental r using(inventory_id)
group by film_id
order by count(rental_id) desc;

-- above Incomplete

SELECT 
    store_id, SUM(totalpc)
FROM
    (SELECT 
        store_id, customer_id, SUM(p.amount) AS totalpc
    FROM
        customer
    INNER JOIN payment p USING (customer_id)
    GROUP BY customer_id) AS cust_payment
GROUP BY store_id;