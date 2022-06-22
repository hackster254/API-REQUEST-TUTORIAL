let mysql = require('mysql')
const config = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "testDB"

}

//display all details of all person
function showAllDetails(){
    let connection = mysql.createConnection(config)
    let sql = "SELECT * from persons"

    connection.query(sql, function(err, result){
        if(err) console.log(err)
        else console.log(result)
    })

}

// display fdetails of a specific person whose name is specified
function showPersonByName(name){
    let connection = mysql.createConnection(config)
    let sql = "SELECT * FROM persons where name=?"
    connection.query(sql, name, function(err, result){
        if(err)console.log(err)
        else {
            console.log('gotten respone is ', result)
        }
    })
}

// insert detetails of a new person
function insertPerson(params){
    let connection = mysql.createConnection(config)
    let sql = "INSERT INTO persons(name,age) VALUES(?,?)"
    connection.query(sql, params, function(err,result){
        if(err) console.log(err)
        else {
            console.log('new person created', result)
            showAllDetails()
        }
    })
}

// insert details of multiple functions
function insertMultiplePersons(array){
    let connection = mysql.createConnection(config)
    let sql = "INSERT into persons(name,age) values ?"
    connection.query(sql, [array], function(err, result){
        if(err)console.log(err)
        else {
            console.log(result)
            showAllDetails()
        }
    })

}

// give id we need to update age
function incrementAge(id){
    let connection = mysql.createConnection(config)
    let sql = "UPDATE persons set age=age+1 WHERE id =?"
    connection.query(sql, id, function(err,result){
        if(err)console.log(err)
        else {
            console.log('age of id incremented ', result)
            showAllDetails()
        }
    })
}

function changeAge(id,newAge){
    let connection = mysql.createConnection(config)
    let sql = "UPDATE persons set age=? WHERE id=?"
    connection.query(sql, [newAge,id], function(err,result){
        if(err)console.log(err)
        else {
            console.log('age of id incremented ', result)
            showAllDetails()
        }
    })

}

// deleting all rows in table
function resetData(){
    let connection = mysql.createConnection(config)
    let sql = "DELETE from persons"
    connection.query(sql, function(err,result){
        if(err)console.log(err)
        else {
            console.log('deleted all records ', result)
            showAllDetails()

            // now we want to insert new details
            let {persons} = require('./sqlData')

            //console.log(persons)
            // convert person json to array
            let newArr = persons.map((p)=> [p.name, p.age])

            let sql2 = "insert into persons(name,age) VALUES ?"
            connection.query(sql2,[newArr], function(err,result){
                if(err)console.log(err)
                else {
                    console.log('successfully readded new persons to db: ',result)
                    showAllDetails()
                }
            })
        }
    
    })

}


//showAllDetails()
//showPersonByName("paul")
//insertPerson(['hello1',56])
//insertMultiplePersons([['brad', 34], ['hamline', 24]])

//incrementAge(2)
//changeAge(4,100)

resetData()