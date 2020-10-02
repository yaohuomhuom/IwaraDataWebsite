console.clear();
var api = require("./lib/api.js");
var express = require('express');
var app = express();
var {
    read
} = require("./lib/file.js");
var Timer = require("./lib/timer.js");
require('express-ws')(app);
var ws_list = [];


var date = new Date();
var day_time = date.toISOString().split("T")[0];
var month_time = date.toISOString().split("-")[0] + "-" + date.toISOString().split("-")[1];
var month_number = parseInt(date.toISOString().split("-")[1]) - 1;
var month_time_fornt = date.toISOString().split("-")[0] + "-" + (month_number > 10 ? month_number : '0' + month_number);
var day_data = read("day/" + day_time);
var month_data = read('month/' + month_time)
var month_front = read('month/' + month_time_fornt)
var day = async function() {
    date = new Date();
    //console.log(date.toISOString()+" 每日信息 开始请求。。。");
    day_time = date.toISOString().split("T")[0];
    day_data = await api.getDataByTime(day_time, "day/" + day_time, 1);
    let res_time = new Date();
    //console.log("\n"+res_time.toISOString()+" 每日信息 请求结束,"+"数据长度"+day_data.length+","+"处理时长:"+(res_time-date)/1000+"s");
    ws_list.forEach((v) => {
        v.ws.send(JSON.stringify({
            name: "day",
            list: day_data
        }));
    });
    let timer = new Timer("查找日期:"+day_time,day,30,1);
    timer.render();
    //setTimeout(day, 1000 * 30);
}
var month = async function() {
    date = new Date();
    //console.log(date.toISOString()+" 当月信息_开始请求。。。");
    month_time = date.toISOString().split("-")[0] + "-" + date.toISOString().split("-")[1];
    month_data = await api.getDataByTime(month_time, 'month/' + month_time,2);
    let res_time = new Date();
    //console.log("\n"+res_time.toISOString()+" 当月信息 请求结束,"+"数据长度"+month_data.length+","+"处理时长:"+(res_time-date)/1000+"s");
    ws_list.forEach((v) => {
        v.ws.send(JSON.stringify({
            name: "month",
            list: month_data
        }));
    });
    let timer = new Timer("查找日期:"+month_time,month,300,2);
    timer.render();
}

var month_front = async function() {
    date = new Date();
    //console.log(date.toISOString()+" 前月信息_开始请求。。。");
    month_number = parseInt(date.toISOString().split("-")[1]) - 1;
    month_time_fornt = date.toISOString().split("-")[0] + "-" + (month_number > 10 ? month_number : '0' +
        month_number);
    month_data_fornt = await api.getDataByTime(month_time_fornt, 'month/' + month_time_fornt, 3);
    let res_time = new Date();
    //console.log("\n"+res_time.toISOString()+" 前月信息 请求结束,"+"数据长度:"+month_data_fornt.length+","+"处理时长:"+(res_time-date)/1000+"s");
    ws_list.forEach((v) => {
        v.ws.send(JSON.stringify({
            name: "month_front",
            list: month_data_fornt
        }));
    });
    let timer = new Timer("查找日期:"+month_time_fornt,month_front,300,3);
    timer.render();
}

day();
month();
month_front();
app.ws('/ws', function(ws, req) {
    console.log(req.query);
    //ws.send(JSON.stringify(day_data));
    ws.send(JSON.stringify({
        name: "init",
        day: day_data,
        month: month_data
    }));
    ws.on('message', function(msg) {
        if (msg == "ping") {
            ws.send("pong");
            return;
        }
        var data = JSON.parse(msg);
        if (data && data.name == 'day') {
            ws.send(JSON.stringify({
                name: "day",
                list: day_data
            }));
        } else if (data && data.name == 'month') {
            ws.send(JSON.stringify({
                name: "month",
                list: month_data
            }));
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
