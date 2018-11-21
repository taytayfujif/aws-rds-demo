# AWS RDS Demo

## What is AWS RDS
A service that allows you to set up and operate a relational database in the cloud. It allows us to create a PostgreSQL instance

## Flow of Data
![Data Flow](https://i.imgur.com/dVy3Wz8.png)

## Postgres Setup
1. Connect to AWS RDS Postgres shell
```
psql --host instanceendpoint --port 5432 --username username --dbname dbname
```
2. Ask your instructor for the user password
3. Create user with encrypted password
4. Grant user to jrdevleague
```
GRANT your_user TO jrdevleague;
```
5. Create database named `hta-YOUR_NAME` with newly created user
6. Connect into newly created database
7. Create table student with the following columns
  - student_id
  - name
  - grade_level
8. Insert data for one student
9. Grant table privileges to user
```
GRANT ALL PRIVILEGES ON TABLE YOUR_TABLE_NAME TO YOUR_USERNAME;
```

## Serverless Setup
1. Create serverless boilerplate/template
2. Change service to `aws-rds-demo-YOURNAME`in your `serverless.yml` 
4. Create a `routes` folder
3. Create a `GET` lambda function in `routes` folder
  - set up your http method
  - set up your http path
  - set up your cors
4.`npm install pg pg-pool`
5. Create config.json file with the following: 

```json
{
  "table": "YOUR_TABLE_NAME",
  "host": "jrdevleague.cb9co1xxtizk.us-west-2.rds.amazonaws.com",
  "database": "YOUR_DATABASE_NAME",
  "user": "YOUR_USERNAME",
  "password": "YOUR_PASSWORD",
  "port": 5432
}
```

6. Add config.json to your `.gitignore`

## Get Lambda Function 
1. Require pg-pool
``` 
const Pool =  require('pg-pool');
```
2. Require config file
```
const config =  require('../config.json')
```
3. Use ES6 Object Destructuring to grab keys/properties from `config.json`
```
const { table, host, database, user, password, port } = config
```
4. Create new client object 
```js
const Client =  new  Pool({
  host,
  database,
  user,
  password,
  port,
  idleTimeoutMillis: 1000
});
```
5. Create a `SELECT` query and save it into a variable
```js
const getAllMovies =  "SELECT * FROM " + table +  ";";
```
6. Your get handler function should look like the following: 
``` js
module.exports.get  = (event, context, callback) => {
  const getAllMovies =  "SELECT * FROM " + table +  ";";
  
  Client.connect()
    .then(client  => {
      console.log('connected to DB ' +  Client.options.database)
      client.release()
      return client.query(getAllMovies)

    })
    .then(res  => {
      const response = {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(res.rows),
      }
      callback(null, response);
      console.log('Your connection will now be terminated')
    })
    .catch(e  => {
      console.log('error', e)
      const response = {
        statusCode: 500,
        headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },

      body: JSON.stringify(e)

      }

    callback(null, response);

  });
};
```
