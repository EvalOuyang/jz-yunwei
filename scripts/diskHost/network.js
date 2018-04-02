/*
 * @Author: yinbanghui
 * @Date:   2017-05-22 21:16:19
 * @Description: 网络设备性能Top5
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-06-09 16:36:04
 */
define(function(require) {

    // 五个雷达图Id获取
    var rada1 = echarts.init(document.getElementById('rada1'));
    var rada2 = echarts.init(document.getElementById('rada2'));
    var rada3 = echarts.init(document.getElementById('rada3'));
    var rada4 = echarts.init(document.getElementById('rada4'));
    var rada5 = echarts.init(document.getElementById('rada5'));

    var tpl = require('../../components/diskHost/network.tpl')
    var template = Handlebars.compile(tpl);

    // 雷达图通用配置项
    var option = {
        tooltip: {
            show: false,
            textStyle: {
                fontSize: 20
            }
        },
        radar: {
            shape: 'circle',
            indicator: [],
            silent: true,
            startAngle: 180,
            center: ['50%', '50%'],
            splitArea: {
                areaStyle: {
                    color: ['rgba(114, 172, 209, 0.0)',
                        'rgba(114, 172, 209, 0)', 'rgba(114, 172, 209, 0)'
                    ],
                    shadowColor: 'rgba(0, 0, 0, 0)',
                    shadowBlur: 10
                }
            },
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                    color: ['#133073', '364b6f'],
                    width: 2
                }
            },
            axisLabel: {
                show: false
            },
            axisLine: {
                show: false
            },
            name: {
                show: false,
                textStyle: {
                    color: "#fff",
                    fontSize: 22
                }
            },
            radius: "55%",
        },
        series: [{
            name: '预算 vs 开销',
            type: 'radar',
            label: {
                normal: {
                    textStyle: {
                        color: "#fff",
                        fontSize: 25
                    }
                }
            },
            lineStyle: {
                normal: {
                    textStyle: {
                        color: "#fff",
                        width: 4
                    }
                }
            },
            itemStyle: {
                normal: {
                    areaStyle: {
                        type: 'default'
                    },
                    color: "#6b67fe"
                }
            },
            data: [{
                value: [4300, 10000, 30000],
                name: '设备名称'
            }]
        }]
    };

    // 存放雷达图1-5个对象
    var radar = [rada1, rada2, rada3, rada4, rada5]

    // 所有CPU、内存、吞吐量值数组
    var data

    var module = {
        /**
         * 网络设备性能top5业务逻辑
         */
        network: function() {
            //清空数组，避免与前面数据累积
            var gpuMaxArray = []
            var flowMaxArray = []
            var memoryMaxArray = []
            var cupValue
            var flowValue
            var merryValue
            var currValue

            // 循环得到CPU、内存、吞吐量
            for (var i = 0, len = data.length; i < len; i++) {
                cupValue = parseFloat(data[i].list[0].value)
                flowValue = data[i].list[1].value
                flowValue = flowValue.replace(/,/g, '')
                flowValue = parseFloat(flowValue)
                merryValue = parseFloat(data[i].list[2].value)
                gpuMaxArray.push(cupValue)
                flowMaxArray.push(flowValue)
                memoryMaxArray.push(merryValue)
            }

            // 求CPU、内存、吞吐量最大值
            var gpuMax = Math.max.apply(null, gpuMaxArray);
            var flowMax = Math.max.apply(null, flowMaxArray);
            var memoryMax = Math.max.apply(null, memoryMaxArray);

            // 绘制雷达图
            for (var i = 0, len = data.length; i < len; i++) {
                option.radar.indicator = []
                option.series[0].data[0].name = data[i].name
                var value = []
                for (var j = 0; j < 3; j++) {
                    currValue = data[i].list[j].value
                    currValue = currValue.replace(/,/g, '')
                    currValue = parseFloat(currValue)
                    value.push(currValue)
                    option.radar.indicator.push({
                        name: data[i].list[j].name + '\n' + data[i].list[j].value,
                        max: 0
                    })
                }
                var temp = value.splice(1, 1)
                value = value.concat(temp)
                temp = option.radar.indicator.splice(1, 1)
                option.radar.indicator = option.radar.indicator.concat(temp)
                option.radar.indicator[0].max = 100
                option.radar.indicator[1].max = 100
                option.radar.indicator[2].max = flowMax
                option.series[0].data[0].value = value

                radar[i].setOption(option);
            }
            // 设备名称
            for (var i = 0, len = data.length; i < len; i++) {
                for (var j = 0, lenJ = data[i].list.length; j < lenJ; j++) {
                    data[i].ip = data[i].list[3].value
                    data[i].name = data[i].list[4].value
                }
            }

            //渲染模板
            $('.nameList').html(template(data))
        },
        /**
         * 页面初始化调用
         * @param {result} 后端返回数据
         */
        init: function(result) {

            data = result.slice(0, 5)
            module.network()

            //执行定时器
            // var isHead = false
            // int = setInterval(function() {
            //     if (isHead) {
            //         data = result.slice(0, 5)
            //         isHead = false
            //     } else {
            //         data = result.slice(5, 10)
            //         isHead = true
            //     }
            //     module.network()
            // }, 60000);
        }
    }

    return module
})