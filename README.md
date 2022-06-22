
# Api Tutorial

This is a tutorial of creating a backend API using nodejs and data from a js file




## Running Tests

To run tests, run the following command

Steps: first fork the repo and install the necessary npm package with this command
```bash
  npm install
```

Then run the api using command
```bash
  npm run start
```

For the app we are having mock student data in data.js file
We are having multiple endpoints
1. GET   /api/students 
This return all the students

Using query

2. GET   /api/students?grade=A
Returns the studens with specific grade such as A, B etc

3. GET  /api/students?course=React
Returns the students for a specific number of course. 
This can take multiple course as well. 
Use: /api/students?course=React,JS

4. GET  /api/students?course=JS,React&JS&grade=A 
Getting students for a particular set of course with a specific grade

5. GET  /api/students?course=JS,React&grade=B&sort=name

This allow for futher filtering by sorting by name or by course

Using params

6. GET  /api/students/id
Get specific student data by unique id

7. POST /api/students
Creating a new student requires id which is autoincrement from last know maximum id and body
Body is fields for the new user


8. PUT /api/students/id
Allow to update student data from the specified id
Requires a body with the items to update. For example: 

body = {
    "name": "Elon",
    "course": "AI",
    "city": "Dallas"
    "grade": "A"
}

9. DELETE /api/students/id
Deletes specified student data










## Tech Stack

**Server:** Node, Express


## Appendix

Next implementation is to connect this to  a MySQL server and update the record to a DB

