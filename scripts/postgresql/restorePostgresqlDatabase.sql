-------------------------------
-- POSTGRESQL DATABASE RESTORE
-------------------------------

-------------------------------
-- Drop vlibrasdev user
-------------------------------
DROP USER IF EXISTS vlibrasdev;

-------------------------------
-- Revoke privileges on functions
-------------------------------
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM vlibrasdevelopers;

-------------------------------
-- Revoke privileges on tables
-------------------------------
REVOKE SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES ON ALL TABLES IN SCHEMA public FROM vlibrasdevelopers;

-------------------------------
-- Revoke privileges on public schema
-------------------------------
REVOKE USAGE, CREATE ON SCHEMA public FROM vlibrasdevelopers;

-------------------------------
-- Revoke privileges on vlibrasdevdb
-------------------------------
REVOKE CONNECT ON DATABASE vlibrasdevdb FROM vlibrasdevelopers;

-------------------------------
-- Drop vlibrasdevelopers role
-------------------------------
DROP ROLE IF EXISTS vlibrasdevelopers;

-------------------------------
-- Drop vlibrasdevdb database
-------------------------------
DROP DATABASE IF EXISTS vlibrasdevdb;
