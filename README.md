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
GRANT your_user TO "jrDevleague";
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
3. Create a `routes` folder
4. Add `iamRoleStatements` to allows rds in your `serveless.yml`
```yml
iamRoleStatements:
  - Effect: Allow
    Action:
      - rds:*
    Resource: "*"
```
5. Create a `GET` lambda function in `routes` folder
  - set up your http method
  - set up your http path
  - set up your cors
6.`npm install pg pg-pool`
7. Create config.json file with the following: 

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
4. Create new pool object 
```js
const pool =  new  Pool({
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
6. Use `pool.connect()` to connect to database
7. Within the response use `client.release()` to open up database for query
8. Run `return client.query(YOUR_QUERY)` to make your query
9. Your get function should look like the following: 
``` js
module.exports.get = (event, context, callback) => {

  const getAllStudents = "SELECT * FROM " + table + ";";

  pool.connect()
    .then(client => {
      client.release()
      return client.query(getAllStudents)
    })
    .then(res => {

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(res.rows),
      }

      callback(null, response);
    })
    .catch(error => {
      console.log('error', error)

      const response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(error)
      }
      callback(null, response);
    });
};
```
10. Invoke function or run GET endpoint in Postman

## POST Lambda Function 
1. Allow permission to your table name
```
GRANT USAGE, SELECT ON SEQUENCE TABLE_NAME_id_seq TO jay;
```
2. Add `integration: lambda` under `cors: true` of your post function in `serverless.yml`
3. Create insert query
```
const postStudent =  "INSERT INTO " + table +  " Values(default, $1, $2)"
```
4. Pass in values within `pool.connect()` code block with the following
```
return client.query(postStudent, \[name, grade_level\])
```
5. Your post function should look like the following: 
```js
module.exports.post = (event, context, callback) => {
    let { name, grade_level } = event.body

    const postStudent = "INSERT INTO " + table + " Values(default, $1, $2)"

    pool.connect()
        .then((client) => {
            client.release()
            return client.query(postStudent, [name, grade_level])
        })
        .then((res) => {
            const response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true
                },
                body: JSON.stringify(res)
            }
            callback(null, response);
            console.log('Your connection will now be terminated')
        })
        .catch(e => {
            console.log('error', e)
            const response = {
                "statusCode": 500,
                "body": JSON.stringify(e)
            }
            callback(null, response);
        });
};
```
## Class Exercise
- Implement Put & Delete method
[Update Query Documentation](https://www.postgresql.org/docs/11/sql-update.html)

[PostgreSQL: Documentation: 11: DELETE](https://www.postgresql.org/docs/11/sql-delete.html)


## Resources
[What Is Amazon Relational Database Service (Amazon RDS)? - Amazon Relational Database Service](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)

[pg-pool](https://www.npmjs.com/package/pg-pool)






