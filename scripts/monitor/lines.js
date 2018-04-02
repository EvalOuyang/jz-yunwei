/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-29
 * @Description: 时间轴交互后温、湿度曲线图
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('jquery')
    require('echarts')

    var tempuratureTrend
    var humidityTrend

    //基本配置项
    var option = {
        title: {
            text: '',
            textAlign: 'left',
            left: 50,
            textStyle: {
                color: '#628bc4'
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#3471fd'
        },
        grid: {
            left: 100,
            top: 50,
            right: 50
        },
        toolbox: {
            show: false
        },
        dataZoom: [{
            type: 'inside'
        }],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisTick: {
                alignWithLabel:true
            },
            axisLine: {
                lineStyle: {
                    color: '#52ccff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#b1b1b1',
                    fontSize: 16
                }
            },
            data: []
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#52ccff'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    width: .5,
                    opacity: .3
                }
            },
            axisLabel: {
                //formatter: '',
                textStyle: {
                    color: '#b1b1b1',
                    fontSize: 16
                }
            }
        },
        series: [{
            name: '',
            type: 'line',
            data: [],
            showAllSymbol: true,
            clipOverflow: false,
            lineStyle: {
                normal: {
                    color: '#5e8efe'
                }
            },
            itemStyle: {
                normal: {
                    color: '#5e8efe'
                }
            },
            markPoint: {
                data: [
                    { type: 'max', name: '最大值' },
                    { type: 'min', name: '最小值' }
                ]
            }
        }]
    }

    /**
     * 
     * 折线图初始化，传入数据
     * 
     * @param {object} data 传入的温度、湿度的折线数据集
     */
    function init(data) {
        //初始化折线图
        tempuratureTrend = echarts.init(document.getElementById('tempurature-trend'))
        humidityTrend = echarts.init(document.getElementById('humidity-trend'))

        //根据数据集绘制折线图
        var temperature = data.temperature
        var humidity = data.humidity
        tempuratureLine(temperature)
        humidityLine(humidity)
    }

    /**
     * 画温度曲线
     * 
     * @param {array} data 温度曲线数据集
     */
    function tempuratureLine(data) {
        var xAxisData = []
        var yAxisData = []
        var max = d3.max(data, function(d, i) {
            return d.value
        })
        var min = d3.min(data, function(d, i) {
            return d.value
        })
        var options = option
        options.series[0].name = '温度'
        options.title.text = '温度(℃)'
        for (var i = 0, length = data.length; i < length; i++) {
            xAxisData.push(data[i].time)
            yAxisData.push(data[i].value)
        }
        options.yAxis.max = (parseInt(max / 10) + 1) * 10
        options.yAxis.min = parseInt(Math.floor(min) / 10) * 10
        options.xAxis.data = xAxisData
        options.series[0].data = yAxisData
        
        tempuratureTrend.setOption(options)
    }

    /**
     * 画湿度曲线
     * 
     * @param {array} data 湿度曲线数据集
     */
    function humidityLine(data) {
        var xAxisData = []
        var yAxisData = []
        var max = d3.max(data, function(d, i) {
            return d.value
        })
        var min = d3.min(data, function(d, i) {
            return d.value
        })
        var options = option
        options.series[0].name = '湿度'
        options.title.text = '湿度(%)'
        for (var i = 0, length = data.length; i < length; i++) {
            xAxisData.push(data[i].time)
            yAxisData.push(data[i].value)
        }
        options.yAxis.max = (parseInt(max / 10) + 1) * 10
        options.yAxis.min = parseInt(Math.floor(min) / 10) * 10
        options.xAxis.data = xAxisData
        options.series[0].data = yAxisData
        humidityTrend.setOption(options)
    }

    var result = {
        init: init
    }
    return result
})