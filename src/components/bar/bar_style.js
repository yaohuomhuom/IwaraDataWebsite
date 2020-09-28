import echarts from 'echarts';

export default {
    bar_blue: {
        type: "line",

        smooth: true,
        name: '折线图',
        symbol: 'none',
        lineStyle: {
            color: '#3275FB',
            width: 3,
            shadowColor: 'rgba(0, 0, 0, 0.3)', //设置折线阴影
            shadowBlur: 10,
            shadowOffsetY: 10,
        },
        areaStyle: {
            normal: {
                color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [{
                            offset: 0,
                            color: 'rgba(73, 86, 255, 0.5)',

                        },
                        {
                            offset: 1,
                            color: 'rgba(255, 255, 255, 0.1)',
                        }
                    ],
                    false
                ),


            }
        }
    },
    bar_pink: {
        color: "#ff80b0",
        itemStyle: {
            barBorderRadius: [20, 20, 0, 0]
        },
        showBackground: true,
        backgroundStyle: {
            color: '#ffe2e2'
        },
        markPoint: {
            symbolSize: (v) => {
                var long = (v.toString().length + 1) * 12;
                return [long, long]
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
    chart_pink: {
        dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            start: 0,
            end: 100
        }, {
            type: 'inside',
            realtime: true,
            start: 65,
            end: 85
        }],
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            right: "15%",
            itemSize: 30
        },
        backgroundColor: "#ffc7c7",
    },
    chart_blue: {
        backgroundColor: '#fff',
        grid: {
            top: '100',
            right: '40',
            left: '60',
            bottom: '40' //图表尺寸大小
        },
    },
    bar_default: {},
    chart_default: {}
}
