/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 动环监测初始化js
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('jquery')
    var api = require('api.config')
    var utils = require('utils')
    var date = require('date')
    var paramsWatcher = require('./paramsWatcher.js')
    var BarCharts = require('./barCharts.js')
    var lines = require('./lines.js')
    var humidityBar = null
    var temperatureBar = null
    var monitorWs = null

    /**
     * 根据结果集构建下拉选项
     * @param {array} data 后台返回的结果集
     */
    var initRoomList = function(data) {
        var dataset = {}
        var roomList = []
        var roomItem = {}
        var params = data.corpsRoom
        var temperature = data.temperature
        var humidity = data.humidity
        var defaultRoom = ''
        for (var i = 0; i < temperature.length; i++) {
            roomItem = {}
            if (temperature[i].name.indexOf('三亚湾') > -1) {
                defaultRoom = temperature[i].name
            }
            roomItem.name = temperature[i].name
            roomItem.temperature = temperature[i].value
            roomItem.voltage = Number(parseInt(params[2].value) + Math.random()).toFixed(1)
            roomItem.electric = Number(parseInt(params[3].value) + Math.random()).toFixed(1)
            for (var j = 0; j < humidity.length; j++) {
                if (humidity[j].name == temperature[i].name) {
                    roomItem.humidity = humidity[j].value
                    roomList.push(roomItem)
                    break
                }
            }
        }
        dataset.defaultRoom = defaultRoom
        dataset.data = roomList
        $('.leftBottom .jifang-selection').remove()
        $('.leftBottom .jifang-dropdown').remove()
        var tpl = require('../../components/monitor/jifangList.tpl')
        var template = Handlebars.compile(tpl)
        $('.leftBottom').append(template(dataset))
        dataset = null

        //选择框点击事件，切换下拉列表的隐藏与显示
        $('.leftBottom .jifang-selection').on('click', function() {
            $('.leftBottom .jifang-dropdown').toggle()
        })

        //下拉列表中每一项的鼠标事件，鼠标移上去的那一项高亮显示，其余项恢复默认样式
        $('.leftBottom .jifang-dropdown').off('mouseover').on('mouseover', 'li', function() {
            $(this).css({
                'color': '#fff',
                'background': '#3471fd'
            })
            $(this).siblings().css({
                'color': '#86abff',
                'background': '#0b1f76'
            })
        })

        //下拉列表项的选中事件，选中某一项的时候切换四个环境参数，并且将选择框的值修改为当前选中的值
        $('.leftBottom .jifang-dropdown').off('click').on('click', 'li', function(e) {
            var jifang = $(this).html()
            $('.leftBottom .jifang-selection').html(jifang)
            $('.leftBottom .jifang-dropdown').hide()

            //更新数据
            var temperature = Number($(this).attr('data-temperature'))
            var humidity = Number($(this).attr('data-humidity'))
            var voltage = Number($(this).attr('data-voltage'))
            var electric = Number($(this).attr('data-electric'))
            var data = [{
                    name: '温度',
                    value: temperature
                },
                {
                    name: '湿度',
                    value: humidity
                },
                {
                    name: '电压',
                    value: voltage
                },
                {
                    name: '电流',
                    value: electric
                }
            ]
            paramsWatcher.update(data)
        })

        //当鼠标移出下拉列表区域时，隐藏下拉列表
        $('.leftBottom .jifang-dropdown').on('mouseout', function(e) {
            if (e.relatedTarget.nodeName.toLowerCase() == 'li') return
            $(this).hide()
        })
    }

    //对外接口对象
    var Index = {
        /**
         * 处理数据函数
         *
         * @param {object} 后端返回数据
         */
        dealData: function(data) {
            var corpsRoom = data.result.corpsRoom
            var temperature = data.result.temperature
            var humidity = data.result.humidity
            initRoomList(data.result)

            //过滤掉三亚湾机房的数据，不显示
            for (var i = 0; i < temperature.length; i++) {
                if (temperature[i].name.indexOf('三亚湾') > -1) {
                    temperature.splice(i, 1)
                    break
                }
            }
            for (var i = 0; i < humidity.length; i++) {
                if (humidity[i].name.indexOf('三亚湾') > -1) {
                    humidity.splice(i, 1)
                    break
                }
            }

            paramsWatcher.init(corpsRoom)
            temperatureBar.updateData(temperature)
            humidityBar.updateData(humidity)
        },

        init: function() {
            utils.zoomOther()
            humidityBar = new BarCharts({
                el: '.humidity-bar',
                yaxisLabel: '湿度',
                yaxisUnit: '%'
            })
            temperatureBar = new BarCharts({
                el: '.temperature-bar',
                yaxisLabel: '温度',
                yaxisUnit: '℃'
            })
            monitorWs = utils.getData(api.isOnline, api.monitor, null, Index.dealData)

            //时间轴选择界面
            date.initPicker('month', '.datePicker-trigger', 'mousemove', dateCallback)

            //日历按钮查询事件
            function dateCallback(startTime, endTime) {

                $('.trend-container').show()

                //更新回调函数
                function callback(data) {
                    var data = data.result
                    var temperature = data.temperature
                    var humidity = data.humidity
                    var data = {
                        temperature: temperature,
                        humidity: humidity
                    }
                    lines.init(data)
                }

                $('.datePicker-trigger').off()

                //请求数据
                utils.getData(api.isOnline, api.HOST + '/monitor/startTime/' + startTime + '/endTime/' + endTime + '', null, callback)

                //曲线面板关闭按钮事件
                $('.trend-container .close-btn').off().on('click', function() {
                    $('.trend-container').hide()
                    setTimeout(function() {
                        date.initPicker('month', '.datePicker-trigger', 'mousemove', dateCallback)
                    }, 5000);
                })
            }
        }
    }
    return Index
})