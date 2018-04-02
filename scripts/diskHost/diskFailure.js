/*
 * @Author: yinbanghui
 * @Date:   2017-05-22 20:21:58
 * @Description: 磁盘故障历史
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-06-08 10:24:54
 */

define(function(require) {

    var pie = echarts.init(document.getElementById('pie'));
    var dataset = []
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            textStyle: {
                fontSize: 20
            }
        },
        silent: true,
        color: ['#ffac1b', '#527bff', '#2c4ede', '#1234c4', '#0e299c'],
        series: [{
            name: '磁盘故障',
            type: 'pie',
            radius: ['20%', '60%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: true,
                    position: 'inside',
                    //formatter:'{b}\n{d}%'
                    formatter: function(params, tick, callback) {
                        if (params.percent) {
                            return params.name + '\n' + params.percent + '%'
                        } else {
                            return ''
                        }
                    }
                },
                emphasis: {
                    show: true,
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
            tooltip: {
                show: false
            },
            data: []
        }]
    };
    var list = require('../../components/diskHost/diskFailure.tpl')
    var template = Handlebars.compile(list);

    var module = {
        /**
         * 磁盘故障历史业务逻辑
         *
         * @param {object} data 返回待处理数据
         */
        init: function(data) {
            // 故障磁盘（块）总量
            $(".amount").html(data.total.toLocaleString())

            // 曙光、浪潮M4、IBM、华为2485、华为2288  5个厂家统计各自的硬盘总数、坏盘数、未维修的数量。
            $('.list').html(template(data.list));

            //遍历每一组列表，如果发现该项没有百分比，也没有总数，那么将故障显示移到区域中间
            $.each($('.list li'), function() {
                var percent = $(this).find('.percent')
                var total = $(this).find('.guzhang-total')
                var notRepair = $(this).find('.notRepair')
                if (percent.text() == '' && total.text() == '') {
                    percent.css({ 'display': 'none' })
                    total.css({ 'display': 'none' })
                    notRepair.css({ 'margin-top': '30px' })
                } else {
                    percent.css({ 'display': 'block' })
                    total.css({ 'display': 'block' })
                    notRepair.css({ 'margin-top': '0' })
                }
            })

            // 画饼图
            dataset = data.list
            for (var i = 0; i < dataset.length; i++) {
                dataset[i].value = Number(dataset[i].notRepair + dataset[i].willAlarm).toFixed(1)
            }
            option.series[0].data = dataset
            pie.setOption(option);
        }
    }

    return module
})