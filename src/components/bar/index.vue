<template>
    <v-chart ref="v_chart" :options="option" @click="onClick" />
</template>

<script>
    import ECharts from 'vue-echarts';
    export default {
        name: "BarEcharts",
        components: {
            'v-chart': ECharts
        },
        computed: {
            option(){
                    var _data_options = JSON.parse(JSON.stringify(this.data_options));
                    if(this.list_x != null){
                        _data_options.xAxis = {}
                        _data_options.xAxis.data = this.list_x;
                        _data_options.tooltip.formatter = this.data_options.tooltip.formatter;
                    }
                    this.series_list.forEach((v) => {   
                        v.type = this.type;
                        _data_options.series.push(v);
                    });
                    return _data_options;
            }
        },
        data() {
            return {
                type:'bar',
                charts:{},
                org_data:[],
                show_data:[],
                list_x: [],
                series_list:[],
                data_options: {
                    dataZoom: [{
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: 100
                    },{
                        type: 'inside',
                        realtime: true,
                        start: 65,
                        end: 85
                    }],
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {},
                    yAxis: {},
                    series: []
                }
            }
        },
        methods: {
            onClick(params) {
                window.open("https://ecchi.iwara.tv" + params.data.url)
            },
            sortData(name,way){
                var _find_ = this.series_list.findIndex((v) => {
                    return v.name == name;
                });
                
                this.series_list[_find_].data = this.series_list[_find_].data.sort((a,b)=>{
                    if(way == "up"){
                        return a.value - b.value;
                    }else{
                        return b.value - a.value;
                    }
                });
                this.list_x = this.series_list[_find_].data.map((v)=>{
                    return v[this.charts.x];
                })
            },
            restartData(name){
                var find_org_index = this.org_data.findIndex((v) => {
                    return v.name == name;
                });
                this.setDataByObject(this.org_data[find_org_index].data,this.charts,name);
            },
            initDataByObject(org_data,charts,name){
                this.charts = charts;
                this.org_data.push({name:name,data:org_data});
                var show_data = org_data.map((v)=>{
                    v.value = v[charts.y];
                    return v;
                });
                this.series_list.push({
                    name:name,
                    data:show_data
                });
                if(charts.x){
                    this.list_x = show_data.map((v)=>{return v[charts.x];})
                }
            },
            setDataByObject(set_data,charts,name){
                this.charts = charts;
                let _find = this.series_list.findIndex((v) => {
                    return v.name == name;
                })
                if(!~_find){
                    return
                }
                set_data =set_data.map((v)=>{
                    v.value = v[charts.y];
                    return v;
                });
                this.series_list[_find].data = set_data;
                if(charts.x){
                    this.list_x = set_data.map((v)=>{return v[charts.x];})
                }
            },
            setToolTip(trigger,formatter){
                this.data_options.tooltip.trigger = trigger;
                this.data_options.tooltip.formatter = formatter;
            },
            addData(name, x, y) {
                var find = this.series_list.findIndex((v) => {
                    return v.name == name;
                })
                if (~find) {
                    if (y instanceof Array) {
                        this.series_list[find].data = this.series_list[find].data.concat(y);
                    } else {
                        this.series_list[find].data.push(y);
                    }
                } else {
                    if (y instanceof Array) {
                        this.series_list.push({
                            name: name,
                            data: y
                        })
                    } else {
                        this.series_list.push({
                            name: name,
                            data: [y]
                        })
                    }
                }
                if (x instanceof Array) {
                    this.list_x = this.list_x.concat(x);
                } else {
                    this.list_x.push(x);
                }
            },
            setData(name, x, y) {
                var find = this.series_list.findIndex((v) => {
                    return v.name == name;
                })
                console.log(find)
                if (~find) {
                    console.log(y)
                    this.series_list[find].data = y;
                    this.list_x = x;
                } else {
                    var new_obj = {
                        name: name
                    }
                    new_obj.data = y;
                    this.series_list.push(new_obj);
                    this.list_x = x;
                }
             }
        }
    }
</script>

<style>
</style>
