# PickTheDishes
===============


A SkipTheDishes clone made by Heesoo, JC and Jason for our midterm project!
Live : https://pickthedishes.herokuapp.com/


## Front Page

!["Screenshot front top page"](https://github.com/tothenextcode/PickTheDishes/blob/master/docs/Top%20of%20main%20page.png?raw=true)

!["Screenshot front mid page"](https://github.com/tothenextcode/PickTheDishes/blob/master/docs/Mid%20Section%20of%20main%20page.png?raw=true)

!["Screenshot front bottom page"](https://github.com/tothenextcode/PickTheDishes/blob/master/docs/Bottom%20of%20main%20page.png?raw=true)

## Customer order page

!["Screenshot of customer orders"](https://github.com/tothenextcode/PickTheDishes/blob/master/docs/Customers%20order%20page.png?raw=true)

## Owner/Staff order management page

!["Screenshot of owner/staff orders management"](https://github.com/tothenextcode/PickTheDishes/blob/master/docs/Owner:Staff%20order%20management%20page.png?raw=true)


## Getting Started

1. Create a Twilio account. Visit https://www.twilio.com/

2. Update the .env file with your correct local information 
- username: `ExampleName` 
- password: `ExamplePassword` 
- database: `ExampleDBName`
- KEY: `ChooseAKey`
- TWILIO_ACCOUNT_SID: `YourTwilioSid`
- TWILIO_AUTH_TOKEN: `YourTwilioToken`
- TWILIO_NUMBER: `YourTwilioNumber`
- RESTAURANT_NUMBER: `YourNumber`
- USER_NUMBER: `YourNumber`

3. Install dependencies: `npm i`

5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB

7. Run the server: `npm run local`

8. Visit `http://localhost:8080/`

9. You may log in as a owner using ID 1 and a customer using ID 2.


## Warnings & Tips

- Use the `npm run db:reset` command each time there is a change to the database schema or seeds. 
  - It runs through each of the files, in order, and executes them against the database. 
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.


## Dependencies

- Body-parser: "^1.20.0",
- Chalk: "^2.4.2",
- Cookie-session: "^2.0.0",
- Dotenv: "^2.0.0",
- Ejs: "^2.6.2",
- Express: "^4.17.1",
- Moment: "^2.29.3",
- Morgan: "^1.9.1",
- Pg: "^8.5.0",
- Sass: "^1.35.1",
- Twilio: "^3.77.0"
