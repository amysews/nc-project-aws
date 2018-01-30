"use strict";
var AWS = require("aws-sdk");
// var s3 = new AWS.S3({
//  apiVersion: "2012–09–25"
// });
// console.log('****', s3)

var eltr = new AWS.ElasticTranscoder({
 apiVersion: "2012–09–25",
 region: "us-east-1"
});

exports.handler = function(event, context) {
  console.log('the new s3 event is being triggered');
  console.log("Executing Elastic Transcoder Orchestrator");
 var key = event.Records[0].s3.object.key;
 var pipelineId = "1516962049378-vnxtm2";

 var srcKey =  decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " ")); //the object may have spaces  
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
 console.log("Starting Job");
 eltr.createJob(params, function(err, data){
  if (err){
  console.log(err);
  } else {
  console.log(data);
  }
  context.succeed("Job well done");
 });
};
