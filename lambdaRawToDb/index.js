"use strict";
var mysql = require('mysql');
var config = require('./config.json');
var AWS = require("aws-sdk");
// var s3 = new AWS.S3({
//  apiVersion: "2012–09–25"
// });
// console.log('****', s3)

var pool = mysql.createConnection({
  host: config.dbhost,
  port: 3306,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbname
});

var eltr = new AWS.ElasticTranscoder({
 apiVersion: "2012–09–25",
 region: "us-east-1"
});

console.log('Loading function');

exports.handler = function(event, context) {
  console.log('the new s3 event is being triggered');
  console.log('writing to sql');
 var key = event.Records[0].s3.object.key;
 var srcKey =  decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); //the object may have spaces  
 const id = key.slice(1, key.indexOf('.'))
 console.log(id, "id");
 let table;
 if (key.slice(0,1) == 'a') {
   table = 'answers'
 } else {
   table = 'questions'
 }
 console.log(table, "table");
 context.callbackWaitsForEmptyEventLoop = false;
 pool.query(`UPDATE ${table} SET raw_audio_in_bucket = true WHERE id = ${id}`, function (err, rows, fields) {
  if (err) {
    console.log(err);
    //context.fail(err);
  }
  console.log(null, 'The sql solution is: ', rows);

  //context.succeed(null);
});

 console.log("Executing Elastic Transcoder Orchestrator");
 var pipelineId = "1516962049378-vnxtm2";
 var newKey = key.split('.')[0];
 var params = {
  PipelineId: pipelineId,
  //OutputKeyPrefix: newKey + "/",
  Input: {
  Key: srcKey,
  FrameRate: "auto",
  Resolution: "auto",
  AspectRatio: "auto",
  Interlaced: "auto",
  Container: "auto"
  },
  Output: {
    		Key: newKey + '.mp3',
    		ThumbnailPattern: '',
    		PresetId: '1351620000001-300040',
    		Rotate: 'auto'
    	}
 };
 console.log("Starting Transcoder Job");
 eltr.createJob(params, function(err, data){
  if (err){
  console.log(err);
  } else {
  console.log(data);
  }
  context.succeed("Job well done");
 });
 return;
};
