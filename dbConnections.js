let mysql = require('mysql')

const config = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "studentdb"

}


function getConnection(){
    return mysql.createConnection(config)
}


module.exports = {getConnection}