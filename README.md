sequelize-auto-ts
=================

Generate Sequelize definition statements and compatible TypeScript definitions from a database schema


Table names on MySQL and Windows

Table and database names are stored on disk using the lettercase specified in the CREATE TABLE or
CREATE DATABASE statement, but MySQL converts them to lowercase on lookup. Name comparisons are not case sensitive.

http://dev.mysql.com/doc/refman/5.0/en/identifier-case-sensitivity.html

lower_case_table_names=2

