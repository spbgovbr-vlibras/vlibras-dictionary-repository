-----------------------------
-- POSTGRESQL DATABASE SETUP
-----------------------------

-----------------------------
-- Create vlibrasdevdb database
-----------------------------
CREATE DATABASE vlibrasdevdb;

-----------------------------
-- Create vlibradevelopers role
-----------------------------
CREATE ROLE vlibrasdevelopers WITH NOSUPERUSER NOCREATEDB NOCREATEROLE NOLOGIN NOREPLICATION NOBYPASSRLS;

-----------------------------
-- Grant privileges on vlibrasdevdb
-----------------------------
GRANT CONNECT ON DATABASE vlibrasdevdb TO vlibrasdevelopers;

-----------------------------
-- Grant privileges on public schema
-----------------------------
GRANT USAGE, CREATE ON SCHEMA public TO vlibrasdevelopers;

-----------------------------
-- Grant privileges on tables
-----------------------------
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES ON ALL TABLES IN SCHEMA public TO vlibrasdevelopers;

-----------------------------
-- Grant privileges on functions
-----------------------------
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO vlibrasdevelopers;

-----------------------------
-- Create vlibrasdev user
-----------------------------
CREATE USER vlibrasdev LOGIN INHERIT ENCRYPTED PASSWORD 'devpswd' IN ROLE vlibrasdevelopers;
