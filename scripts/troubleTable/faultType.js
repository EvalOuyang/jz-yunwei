/*
 * @Author: yinbanghui
 * @Date:   2017-05-24 22:03:32
 * @Description: 故障类型
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-06-09 13:18:02
 */

define(function(require) {

    require('tabs')
    var util = require('../util/util.js')
    var tpl = require('../../components/troubleTable/faultType.tpl')
    var template = Handlebars.compile(tpl);
    var pie = echarts.init(document.getElementById('pie'))
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            textStyle: {
                fontSize: 20
            }
        },
        color: ['#46aefe', '#3471fd'],
        series: [{
            name: '故障类型',
            type: 'pie',
            radius: ['43%', '67%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: false,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: []
        }]
    };

    var module = {
        /**
         * 故障概况业务逻辑
         *
         * @param {object} data 返回待处理数据
         */
        init: function(data) {
            // 绑定饼图数据
            option.series[0].data = [{
                    name: '前台维护',
                    value: data.FrontEnd.total
                },
                {
                    name: '系统维护',
                    value: data.system.total
                }
            ]

            // 前台维护、系统维护占比计算
            var total = data.FrontEnd.total + data.system.total
            if (total === 0) {
                $(".frontEndPercent").html('50%')
                $(".systemPercent").html('50%')
            } else {
                $(".frontEndPercent").html(parseFloat((data.FrontEnd.total / total) * 100).toFixed(2) + '%')
                $(".systemPercent").html(parseFloat((data.system.total / total) * 100).toFixed(2) + '%')
            }

            // 绘制饼图
            pie.setOption(option);

            // 前台维护、系统维护总量
            $("#FrontEndValue").html(data.FrontEnd.total.toLocaleString())
            $("#systemValue").html(data.system.total.toLocaleString())

            // 前台维护类型列表
            $('.typeList').html(template(data.FrontEnd));

            // 系统维护类型列表
            $('.systemList').html(template(data.system));
        }
    }

    return module
})