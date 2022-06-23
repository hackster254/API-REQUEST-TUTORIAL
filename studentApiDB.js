// this is a restapi with MySQL for database retrieval

let express = require('express')
const app = express()

let {getConnection} = require('./dbConnections')

//applying middlewares
app.use(express.json())

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    )
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

const port = 8000
app.listen(port, ()=> console.log(`Server running on port ${port}`))





// get all students
app.get('/api/students', function(req,res){
    let connection = getConnection()

    let course = req.query.course

    let grade = req.query.grade

    let sort = req.query.sort

    // GET STUDENTS BELONGING to a particular course using query string

    let options = ""
    let optionsArr =[]
    if(course){
        let courseArr= course.split(',') // to get multiple course on querystirng
        //options = " WHERE course=?"
        options = " WHERE course IN (?)"
        optionsArr.push(courseArr)
    }
    if(grade){
        options = options ? `${options} AND grade=? `: ' WHERE grade=? '
        optionsArr.push(grade) 
    }
    if(sort){
        options = `${options} ORDER BY ${sort} `
    }
    let sql = `SELECT * from students ${options}`
    console.log(sql)

    
    
    connection.query(sql,optionsArr, function(err,result){
        if(err){console.log(err)
            res.status(404).send("Error in fetching data")
        }
        else {
            res.status(200).send(result)

        }
    })

})


// fetch student by id
app.get('/api/students/:id', function(req,res){
    let connection = getConnection()
    let id = +req.params.id

    let sql = "select * from students where id=?"
    connection.query(sql, id,function(err,result){
        if(err){
            console.log(err)
            res.status(404).send('error fetching student details for this id : ',err)
        } else if(result.length === 0){
            res.status(404).send('this student does not exist')

        }
        else {
            res.status(200).send(result)
        }
    })
})

// get all students belonging to a course
app.get('/api/students/course/:name', function(req,res){
    let connection = getConnection()
    let name = req.params.name

    let sql = "select * from students where course=?"

    connection.query(sql, name,function(err,result){
        if(err){
            console.log(err)
            res.status(404).send('error fetching student details for this course: ',err)
        } 
        else {
            res.status(200).send(result)
        }
    })
})

// add new students
app.post('/api/students', function(req,res){
    let body = req.body

    let connection = getConnection()

    // ENSURING NAME IS UNIQUE
    let sql1 = "select * from students where name=?"
    connection.query(sql1, body.name, function(err,result){
        if(err) {
            console.log(err)
            res.status(404).send('error fetching student with details with that name : ',err)

        }
        else if(result.length >0){
            res.status(404).send(`Name already exists for this student :${body.name}`)

        } else {

            let sql = "INSERT INTO students(name,course,grade,city) values (?,?,?,?)"

            connection.query(sql,[body.name,body.course, body.grade, body.city],function(err,result){
                if(err){
                    console.log(err)
                    res.status(404).send('error Creating a new student with details : ',err)
                } 
                else {
                    res.status(200).send(`inserted new student with id: ${result.insertId}`)
                }
    })

        }
    })
    


})

// update students for specified id
app.put('/api/students/:id', function(req,res){
    let id = req.params.id
    let body = req.body

    let connection = getConnection()


    let sql = "UPDATE students SET name=?, course=?, grade=?, city=? WHERE id=?"

    let params = [body.name, body.course, body.grade, body.city, id]
    connection.query(sql, params, function(err,result){
        if(err){
            res.status(404).send('error in updating data')
            console.log(err)
        } else if (result.affectedRows ===0){
            res.status(404).send('error: No record was updated')

        } else {
            res.status(200).send(`updated success for ${body.name}`)

        }
         
    })

})

// delete student details
app.delete('/api/students/:id', function(req,res){
    let id = +req.params.id

    let connection = getConnection()


    let sql = "DELETE from students WHERE id=?"

    
    connection.query(sql, id, function(err,result){
        if(err){
            res.status(404).send('error in deleting student data')
            console.log(err)
        } else if (result.affectedRows ===0){
            res.status(404).send('error: No record was deleted')

        } else {
            res.status(200).send("student deleted successfully ")

        }
         
    })
})

// route to truncate table and then insert the records again
// we are gonna use data from data.js file
app.get('/api/resetData', function(req,res){
    // we  will truncate the table so that auto increment is not
    let connection = getConnection()
    //let sql = "DELETE from students"
     let sql = "TRUNCATE table students"

    connection.query(sql, function(err,result){
        if(err){
            res.status(404).send('error urghh')
        } else {
            console.log(`successfully deleted students table contents for ${result.affectedRows}`)

            let {studentData} = require('./data.js')
            // convert json to array
            let arrStudent = studentData.map(st => [st.name, st.course, st.grade, st.city])

            let sql2 = "INSERT into students(name,course,grade,city) VALUES ?"

            connection.query(sql2, [arrStudent], function(err,result){
                if(err){
                    res.status(404).send('error in inserting data after reset')
                }else {
                    res.status(200).send(`reset success. Inserted ${result.affectedRows}`)
                }
            })
        }
    })
})