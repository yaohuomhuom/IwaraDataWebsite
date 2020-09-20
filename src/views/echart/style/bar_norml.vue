<template>
    <div class="div_all">
        <bar-echarts ref='bar' class="div_all" />
        <div @click="sortData('up')">升序按钮</div>
        <div @click="sortData('down')">降序按钮</div>
        <div @click="backData">恢复按钮</div>
        <div @click="backData">
            <router-link :to="'1'">下一页</router-link>
        </div>
    </div>
</template>

<script>
    import BarEcharts from '../../../components/bar/index.vue';
    //import data from "../../../api/file.js";
    export default {
        components: {
            BarEcharts
        },
        mounted() {
            this.$refs.bar.setToolTip('axis',function (params) {
                        for (var x in params) {
                            return "播放量:" + params[x].data.value + '<br/>' +
                                   "链接:" + params[x].data.url + '<br/>' +
                                   "标题:" + params[x].data.title
                        }
                    });
            this.ws_int();
        },
        methods: {
            ws_int() {
                if (typeof(WebSocket) === "undefined") {
                    alert("您的浏览器不支持socket");
                } else {
                    var socket = new WebSocket('ws://localhost:3000/ws?uid=123');
                    var wsping = setInterval(function() {
                        socket.send("ping")
                    }, 5000);
                    this.get_prototype.$ws = {};
                    this.get_prototype.$ws.ws = socket;
                    this.get_prototype.$ws.wsping = wsping;
                    socket.onmessage = this.ws_message;
                    socket.onclose = this.ws_close;
                }
            },
            ws_message(msg) {
                
                if (msg.data == "pong") {
                    return;
                }
                var list_data = JSON.parse(msg.data);
                if(list_data.name == "init"){
                    this.initData(list_data.list)
                }
                else if(list_data.name == "set"){
                    this.setData(list_data.list)
                }
                /*this.initData() */
            },
            ws_close() {
                clearInterval(this.$ws.wsping);
            },
            initData(int_data) {
                this.$refs.bar.initDataByObject(int_data, {
                    x: "time",
                    y: 'view'
                }, 'iw');
            },
            setData(set_data) {
                this.$refs.bar.setDataByObject(set_data, {
                    x: "time",
                    y: 'view'
                }, 'iw');
            },
            sortData(way) {
                this.$refs.bar.sortData("iw", way);
            },
            backData() {
                this.$refs.bar.restartData("iw");
            }
        }
    }
</script>

<style>
</style>
