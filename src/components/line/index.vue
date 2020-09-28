<template>
    <v-chart ref="v_chart" :options="option" @click="onClick" />
</template>

<script>
    import ECharts from 'vue-echarts';
    import line_style from './line_style.js';
    export default {
        computed: {
            option() {
                if(!this.series_list.length){
                    return {};
                }
                var  temp_option = Object.assign(chart_option);
                     temp_option = this.addChartStyle(temp_option);
            }
        },
        methods:{
            addChartStyle(chart_option){
                if(chart_style.model){
                    Object.keys(line_style[chart_style.model]).forEach((v)=>{
                       chart_option[v] = line_style[chart_style.model][v];
                    })
                    if(chart_style.style){
                        Object.keys(chart_style.style).forEach((v)=>{
                           chart_option[v] = chart_style.style[v];
                        })
                    }
                }
                return chart_option;
            },
            addSeries(chart_option){
                if(chart_style.model){
                    Object.keys(line_style[chart_style.model]).forEach((v)=>{
                       chart_option[v] = line_style[chart_style.model][v];
                    })
                    if(chart_style.style){
                        Object.keys(chart_style.style).forEach((v)=>{
                           chart_option[v] = chart_style.style[v];
                        })
                    }
                }
                return chart_option;
            }
        },
        data(){
            return {
                series_list: [{
                    name: "1",
                    type: "line",
                    style: {
                        model: "series_style_1",
                        style: {}
                    },
                    axis: {
                        x: "time",
                        y: "view"
                    }
                    data: [1, 2, 3, 4, 5]
                }],
                chart_style: {
                    model: "chart_style_1",
                    style: {}
                },
                chart_option: {
                    xAxis: {},
                    yAxis: [],
                    series: [],
                }
            }
        }
    }
</script>

<style>
</style>
