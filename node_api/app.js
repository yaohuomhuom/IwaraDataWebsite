var api = require("./lib/api.js");
var express = require('express');
var app = express();
var {
	read
} = require("./lib/file.js");
var day_data = read("now_data");
var month_data = read("month_data")
require('express-ws')(app);
var ws_list = [];

var day = async function(file_name) {
    console.log("开始请求。。。")
    var date = new Date();
    //console.log(date.toISOString().split("T"));
    var time = date.toISOString().split("T")[0];
    day_data = await api.getDataByTime(time, file_name);
    ws_list.forEach((v) => {
        v.ws.send(JSON.stringify({name:"day",list:day_data}));
    })
}
var month = async function(file_name) {
    console.log("开始请求。。。")
    var date = new Date();
    //console.log(date.toISOString().split("T"));
    var time = date.toISOString().split("-")[0]+"-"+date.toISOString().split("-")[1];
    console.log(time);
    month_data = await api.getDataByTime(time, file_name);
    ws_list.forEach((v) => {
        v.ws.send(JSON.stringify({name:"month",list:month_data}));
    })
}/* 
day("now_data"); */
/* setInterval(day, 1000 * 30, "now_data") */
/* month("month_data");
 */
app.ws('/ws', function(ws, req) {
    console.log(req.query);
    //ws.send(JSON.stringify(day_data));
    ws.send(JSON.stringify({name:"init",day:day_data,month:month_data}));
    ws.on('message', function (msg) {
       if(msg == "ping"){
         ws.send("pong");
         return;
       }
       var data = JSON.parse(msg);
       if(data&&data.name == 'day'){
           ws.send(JSON.stringify({name:"day",list:day_data}));
       }else if(data&&data.name == 'month'){
           ws.send(JSON.stringify({name:"month",list:month_data}));
       }
           
    })
    ws_list.push({
        "ws": ws,
        "uid": req.query.uid
    });
    ws.on('close', function() {
        ws_list.splice(ws_list.findIndex((v) => {
            return v.uid == req.query.uid
        }), 1);
        console.log(ws_list)
    })

});

app.listen(3000);
