const mysql = require("mysql");
const util = require("util");
var con;

var query;

function handleDisconnect() {
  con = mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB,
  });

  con.on("error", function (err) {
    console.log("db error", err);
    handleDisconnect();
    // if (err.code === "PROTOCOL_CONNECTION_LOST") {
    //   handleDisconnect();
    // } else {
    //   throw err;
    // }
  });

  query = util.promisify(con.query).bind(con);
}
handleDisconnect();

module.exports = { query };
