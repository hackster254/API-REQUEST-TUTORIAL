const express = require('express')

const {studentData} = require('./data')


const app = express()

// include middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Add headers
app.use(function (req, res, next) {
    res.removeHeader('X-Powered-By');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

// first api
app.get('/api/students',  (req,res)=>{
    //res.send(studentData)
    // using query to get students for a given course
    let courseStr =  req.query.course
    let grade = req.query.grade
    let sort = req.query.sort
    
    console.log(courseStr)
    let studentArr2 = studentData
    if(courseStr){
        let courseArr = courseStr.split(',')
        studentArr2 = studentArr2.filter((st)=> courseArr.find(c1=> c1 === st.course))
    } 
    //if(course) studentArr2 =  studentArr2.filter((st)=> st.course === course)
    if(grade){
        studentArr2 = studentArr2.filter((st)=> st.grade === grade)
    }
    if(sort==="name"){
        studentArr2.sort((st1,st2)=> st1.name.localeCompare(st2.name))
    }
    if(sort ==="course"){
        studentArr2.sort((st1,st2)=> st1.course.localeCompare(st2.course))
    }
    res.status(200).send(studentArr2)
})

// get student per id
app.get('/api/students/:id', (req,res)=> {
    let id = +req.params.id

    let student = studentData.find((st)=> st.id === id)
    if(student){
        res.status(200).json(student)

    } else {
        res.status(404).send('no student found')
    }

   
})
// get students for a given course if given name of course
// using param 
app.get('/api/students/course/:name', function(req,res) {
    let name = req.params.name
    const studentArr = studentData.filter((st)=> st.course === name)

    res.send(studentArr)

})

//create a new student
app.post('/api/students', function(req,res) {
    let body = req.body
    console.log(body)
    // howerver we need id
    

    let maxId= studentData.reduce((acc,curr)=> (curr.id >=acc ? curr.id : acc),0)
    console.log(maxId)

    let newID = maxId+1
    let newStudent = {id: newID, ...body}

    studentData.push(newStudent)
   
    res.send(newStudent)

    
})
//updating students details
app.put('/api/students/:id', function(req,res){
    let id = +req.params.id // get it as integer
    let body = req.body

    let index = studentData.findIndex((st)=> st.id === id)
    if(index >=0){
        let updatedStudent = {id: id, ...body}

    studentData[index] = updatedStudent
    res.send(updatedStudent)

    } else {
        res.status(404).send('No student found to update')
    }
    
})

// deleting a student 
app.delete('/api/students/:id', function(req,res){
    let id = +req.params.id

    let index = studentData.findIndex((st)=> st.id === id)
    if(index >0){
        let deletedStudent = studentData.splice(index,1)

        res.send(deletedStudent)
    } else {
        res.status(404).send('No student with that id to DELETE')
    }


})



app.listen(3000, ()=>{
    console.log('app running')
})