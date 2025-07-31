# Bridge-the-Gap

***Meta University Internship Program 2025***

**By: Jackson Seifferly**

“Bridge the Gap” is a social media app intended to help people improve their long distance relationships with friends, family, and significant others! Think more “BeReal” than “Facebook”. The app helps users stay connected by identifying times to meet with each other and proposing challenges or ideas via prompts created by Gemini. The goal of the app is to promote communication despite the distance in a non-overbearing way that makes the process of keeping in touch a fun and enjoyable experience for everyone involved.

## Postgres Setup

This project makes use of a postgres database for the backend of the application, if you do not already have it installed go install it here <https://www.postgresql.org/download/>

Next we will move into the psql shell to set up our database

```bash
psql postgres
```

Now that we are in our postgres terminal we will set up our database with these commands

```sql
    DROP DATABASE IF EXISTS bridgedb;
    DROP ROLE IF EXISTS app_user;
    CREATE ROLE app_user WITH LOGIN PASSWORD '1234';
    ALTER ROLE app_user CREATEDB;
    CREATE DATABASE bridgedb OWNER app_user;
```

Now lets check to make sure our database was properly created

```sql
\l
```

After typing this command you should see a list of databases appear in your terminal, if your database is set up properly you should see a table named 'brdigedb; with a owner named 'app_user'.

Now our database is initialized, lets leave the postgres terminal

```sql
\q
```

Continue to the backend README to finish setup with Prisma
