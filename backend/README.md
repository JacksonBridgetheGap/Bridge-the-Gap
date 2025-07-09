# Backend Dev Setup

## Prisma Database setup

Make sure you completed steps in project README to set up your postgres database on your local device

```sh
npm install
npm run db:init
```

You'll be prompted to name your migration. Name it "first_migration"

You should now see a migrations folder appear in the file directory, your database is now fully initialized with the proper rows and columns.

Following this you'll see output showing your database has been properly seeded. If you run into an error at this point make sure you have ran 'npm install' and all dependencies have properly installed.

## Environment Variable Setup

Now we need to make sure your Prisma is properly accessing the local database, head over to the .env.example file to see the following enviornment varible.

```text
DATABASE_URL="postgresql://{DATABASE_OWNER}:{OWNER_PASSWORD}@localhost:{DATABASE_PORT}/{DATABASE_NAME}?schema=public"
```

Update the bracketed information with the information you provided when setting up your postgres database, if you followed the naming conventions in this guide it will look like this.

```text
DATABASE_URL="postgresql://app_user:1234@localhost:5432/bridgedb?schema=public"
```

As a final check head over to your 'schema.prisma' file to make sure your datasource db is set up as follows.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Testing

To make sure there were no errors in the setup of our backend we're going run a simple Jest testing suite to make sure everything has linked and the functions and types are working properly

```sh
npm test
```

You should see the Jest framework run a series of tests on relevant functions at this point. Make sure all the suites and test cases pass before moving on. If there is an error open a Github issue here <https://github.com/JacksonBridgetheGap/Bridge-the-Gap/issues>

## Start Server

Now that our database is set up we can start up our server and begin to make http requests

```sh
npm run dev
```

Lets check and make sure our database was seend propely by performing our first GET request on the database.

```sh
http :3000/groups
```

If your database has been properly created you should see a list of 5 default groups with 5 default users returned by the request.

Now you can begin making new requests given the routing in index.ts to create, update, or deleted new groups or users.
