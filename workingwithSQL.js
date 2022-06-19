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

showAllDetails()