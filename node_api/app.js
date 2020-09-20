var api = require("./lib/api.js");
var express = require('express');
var app = express();
var {
	read
} = require("./lib/file.js");
var res_data = read("now_data")
require('express-ws')(app);
var ws_list = [];

var day = async function(file_name) {
    console.log("开始请求。。。")
    var date = new Date();
    //console.log(date.toISOString().split("T"));
    var time = date.toISOString().split("T")[0];
    res_data = await api.getDataByTime(time, file_name);
    ws_list.forEach((v) => {
        v.ws.send(JSON.stringify({name:"set",list:res_data}));
    })
}
day("now_data");
setInterval(day, 1000 * 30, "now_data")

app.ws('/ws', function(ws, req) {
    console.log(req.query);
    //ws.send(JSON.stringify(res_data));
    ws.send(JSON.stringify({name:"init",list:res_data}));
    ws.on('message', function (msg) {
       if(msg == "ping"){
         ws.send("pong");
         return;
       }
       ws.send(msg);
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
