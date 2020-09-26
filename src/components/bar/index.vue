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
                    _data_options.toolbox.feature = this.data_options.toolbox.feature;
                    _data_options.series = JSON.parse(JSON.stringify(this.series_list));
                    return _data_options;
            }
        },
        data() {
            return {
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
                    toolbox: {
                        show:true,
                        right:"15%",
                        itemSize:30
                    },
                    xAxis: [],
                    yAxis: [],
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
                var item = {
                    name:name,
                    type:charts.type,
                    data:show_data
                }
                item.yAxisIndex = this.data_options.yAxis.length;
                this.data_options.yAxis.push({type:"value"})
                this.series_list.push(item);
                if(charts.x){
                    this.list_x = show_data.map((v)=>{return v[charts.x];})
                }
            },
            setTempList(name,func,type){
                var data = this.series_list.find(v=>v.name == name);
                if(!data){
                    console.log(data);
                    return;
                }
                var list = JSON.parse(JSON.stringify(data))
                    var show_data = list.data.map((v)=>{
                        v.value = func(v);
                        return  v;
                    })
                    this.data_options.yAxis.push({type:"value"})
                    this.initDataByObject(show_data,{x:this.charts.x,yAxisIndex:1,type:type,y:"value"},"temp");
            },
            setDataByObject(set_data,charts,name){
                let find_temp = this.series_list.findIndex((v)=>{
                    return v.name == "temp";
                })
                if(~find_temp){
                    this.data_options.yAxis.splice(this.series_list[find_temp].yAxisIndex,1)
                    this.series_list.splice(find_temp,1);
                }
                
                
                let find_org = this.org_data.findIndex((v) => {
                    return v.name == name;
                })
                if(!~find_org){
                    return;
                }
                let _find = this.series_list.findIndex((v) => {
                    return v.name == name;
                })
                if(!~_find){
                    return
                }
                
                 this.org_data[find_org].data = set_data;
                this.charts = charts;
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
            setToolBox(feature){
                this.data_options.toolbox.feature = feature;
            },
            addData(name,type, x, y) {
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
                            type:type,
                            data: y
                        })
                    } else {
                        this.series_list.push({
                            name: name,
                            type:type,
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
