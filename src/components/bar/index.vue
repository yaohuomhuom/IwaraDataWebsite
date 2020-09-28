<template>
    <v-chart ref="v_chart" :options="option" @click="onClick" />
</template>

<script>
    import ECharts from 'vue-echarts';
    import bar_style from './bar_style.js';
    export default {
        components: {
            'v-chart': ECharts
        },
        computed: {
            option() {
                if(!this.series_list.length){return {}}
                var _data_options = /* Object.assign(this.data_options); */JSON.parse(JSON.stringify(this.data_options))
                if(this.charts_style){
                    /* Object.keys(this.charts_style).forEach((v)=>{
                        _data_options[v] = this.charts_style[v];
                    }) */
                    _data_options = this.objectAdd(_data_options,this.charts_style);
                }
                /*if (this.list_x != null) {
                    _data_options.xAxis = {}
                    _data_options.xAxis.data = this.list_x;
                    _data_options.tooltip.formatter = this.data_options.tooltip.formatter;
                }*/
                _data_options.xAxis.data = this.list_x;
                _data_options.series = JSON.parse(JSON.stringify(this.series_list))
                this.series_style.forEach((v,i)=>{
                    _data_options.series[i] = this.objectAdd(_data_options.series[i],v);
                })
                return _data_options;
            }
        },
        data() {
            return {
                charts: {},
                org_data: [],
                show_data: [],
                list_x: [],
                series_list: [],
                series_style:[],
                /* series_line:{color: "#8785a2"},
                series_bar: {
                    color: "#ff80b0",
                    itemStyle: {
                        barBorderRadius: [20, 20, 0, 0]
                    },
                    showBackground: true,
                    backgroundStyle: {
                        color: '#ffe2e2'
                    },
                    markPoint: {
                        symbolSize:(v)=>{
                           var long = (v.toString().length+1)*12;
                            return [long,long]
                        },
                        data: [{
                            type: "max"
                        }],
                        symbol: "pin",
                    },
                    markLine: {
                        data: [{
                            type: "average"
                        }],
                        symbol: "pin",
                    },
                    barWidth: "80%"
                },
                */
                charts_style:{},
                data_options: {
                    xAxis: {},
                    yAxis: [],
                    series: []
                }
            }
        },
        methods: {
            objectAdd(o_as,o_to){
                Object.keys(o_to).forEach((v)=>{
                    o_as[v] = o_to[v];
                });
                return o_as;
            },
            onClick() {
                //window.open("https://ecchi.iwara.tv" + params.data.url)
            },
            sortData(name, way, func) {
                var _find_ = this.series_list.findIndex((v) => {
                    return v.name == name;
                });

                this.series_list[_find_].data = this.series_list[_find_].data.sort((a, b) => {
                    if (way == "up") {
                        return a.value - b.value;
                    } else {
                        return b.value - a.value;
                    }
                });
                if (func) {
                    this.series_list[_find_].data = this.series_list[_find_].data.filter(func);
                }
                this.list_x = this.series_list[_find_].data.map((v) => {
                    return v[this.charts.x];
                })
            },
            restartData(name) {
                var find_org_index = this.org_data.findIndex((v) => {
                    return v.name == name;
                });
                this.setDataByObject(this.org_data[find_org_index].data, this.charts, name);
            },
            initDataByObject(org_data, charts,name,style_name) {
                this.charts = charts;
                this.org_data.push({
                    name: name,
                    data: org_data
                });
                var show_data = org_data.map((v) => {
                    v.value = v[charts.y];
                    return v;
                });
                var item = {
                    name: name,
                    type: charts.type,
                    data: show_data
                }
                item.yAxisIndex = this.data_options.yAxis.length;
                 
                this.data_options.yAxis.push({
                    type: "value"
                });

/*                Object.keys(this["series_"+charts.type]).forEach((v) => {
                    if(style&&style[v]){
                        item[v] = style[v];
                    }else{
                        item[v] = this.["series_"+charts.type][v];
                    }
                }) */

                this.series_list.push(item);
                this.series_style.push({});
                if (charts.x) {
                    this.list_x = show_data.map((v) => {
                        return v[charts.x];
                    })
                }
            },
            setTempList(name, func, type) {
                var data = this.series_list.find(v => v.name == name);
                if (!data) {
                    console.log(data);
                    return;
                }
                var list = JSON.parse(JSON.stringify(data))
                var show_data = list.data.map((v) => {
                    v.value = func(v);
                    return v;
                })
                this.data_options.yAxis.push({
                    type: "value"
                })
                this.initDataByObject(show_data, {
                    x: this.charts.x,
                    yAxisIndex: 1,
                    type: type,
                    y: "value"
                }, "temp");
            },
            setDataByObject(set_data, charts, name) {
                let find_temp = this.series_list.findIndex((v) => {
                    return v.name == "temp";
                })
                if (~find_temp) {
                    this.data_options.yAxis.splice(this.series_list[find_temp].yAxisIndex, 1)
                    this.series_list.splice(find_temp, 1);
                }
                let find_org = this.org_data.findIndex((v) => {
                    return v.name == name;
                })
                if (!~find_org) {
                    return;
                }
                let _find = this.series_list.findIndex((v) => {
                    return v.name == name;
                })
                if (!~_find) {
                    return
                }

                /* set_data = set_data.map((v)=>{
                    if(v.view >  5000){
                        v.label = {};
                        v.label.show = true;
                    }
                    return v;
                }) */

                this.org_data[find_org].data = set_data;
                this.charts = charts;
                set_data = set_data.map((v) => {
                    v.value = v[charts.y];
                    return v;
                });
                this.series_list[_find].data = set_data;
                if (charts.x) {
                    this.list_x = set_data.map((v) => {
                        return v[charts.x];
                    })
                }
            },
            setToolTip(trigger, formatter) {
                this.charts_style.tooltip?"":this.charts_style.tooltip={};
                this.charts_style.tooltip.trigger = trigger;
                this.charts_style.tooltip.formatter = formatter;
            },
            setToolBox(feature) {
                this.charts_style.toolbox?"":this.charts_style.toolbox={};
                this.charts_style.toolbox.feature = feature;
            },
            setChartStyle(charts_style){
                if(bar_style[charts_style]){
                   /* Object.keys(bar_style[charts_style]).forEach((v)=>{
                        this.charts_style[v]=bar_style[charts_style][v];
                    }); */
                    var toolbox = this.charts_style.toolbox;
                    var tooltip = this.charts_style.tooltip;
                    
                    this.charts_style = bar_style[charts_style];
                   this.charts_style.toolbox = toolbox;
                   this.charts_style.tooltip = tooltip
                }
            },
            setSeriesStyle(name,series_style){
                let find = this.series_list.findIndex((v) => {
                    return v.name == name;
                });
                if(this.series_list[find]&&bar_style[series_style]){
                    /* Object.keys(bar_style[series_style]).forEach((v)=>{
                        this.series_style[find][v]=bar_style[series_style][v];
                    }) */
                    /* this.series_style[find] = bar_style[series_style]; */
                    this.$set(this.series_style,find, bar_style[series_style]);
                }
            },
            addData(name, type, x, y) {
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
                            type: type,
                            data: y
                        })
                    } else {
                        this.series_list.push({
                            name: name,
                            type: type,
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
