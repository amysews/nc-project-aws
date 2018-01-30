
var mysql = require('mysql');
var config = require('./config.json');
console.log('*************')

var pool = mysql.createConnection({
  host: config.dbhost,
  port: 3306,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname
});

console.log('Loading function');

exports.handler = (event, context, callback) => {
  console.log('the new s3 event is being triggered');
  console.log("flag", event.Records[0].s3.object.key, "flag")
  const filename = event.Records[0].s3.object.key;
  const id = filename.slice(1, filename.indexOf('.'))
  console.log(filename, "£££", id)
  context.callbackWaitsForEmptyEventLoop = false;
  pool.query(`UPDATE answers SET text_in_bucket = true WHERE id = ${id}`, function (err, rows, fields) {
    if (err) {
      callback(err);
      //context.fail(err);
    }
    callback(null, context) //'The solution is: ', rows);

    //context.succeed(null);
  });
}
