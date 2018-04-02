/**
 * @Author:      baizn
 * @DateTime:    2017-06-02 09:24:27
 * @Description: 主页面初始化js
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-06-02 09:24:27
 */
define(function(require) {
    require('jquery')
    var api = require('api.config')
    var utils = require('../util/util.js')
    var CenterBall = require('centerBall')
    var centerMergency = require('centerMergency')
    var alarmList = require('alarmList')
    var lianlu = require('lianlu')
    var LoadPies = require('loadPies')
    var DiskPies = require('diskPies')
    var date = require('date')
    var mainPageWs = null
    var alarmWs = null
    var masterLoadWs = null
    var centerBall = null
    var loadPies = null
    var diskPies = null
    var showTrueLoader = false
    var Index = {
        /**
         * 当前流量、总队及支队链路回调函数
         *
         * @param {object} data 后端返回数据
         */
        dealData: function(data) {
            var result = data.result
            centerBall.updateData(result.flow)
            lianlu.init(result.link)
        },
        /**
         * 告警、紧急情况回调函数
         *
         * @param {object} data 后端返回数据
         */
        detachAlarmData: function(data) {
            var result = data.result
            centerMergency.init(result.mergency)
            alarmList.init(result.alarm)
        },
        /**
         * 主机运行负载分布回调函数
         *
         * @param {object} data 后端返回数据
         */
        detachMasterLoadData: function(data) {
            var result = data.result

            if (!showTrueLoader) {
                //处理所有总数加起来为870
                result.cpu[0].value = 870 - (result.cpu[1].value + result.cpu[2].value + result.cpu[3].value)
                result.cipan[0].value = 870 - (result.cipan[1].value + result.cipan[2].value + result.cipan[3].value)
            }

            if (result) {
                loadPies.updateData(result.cpu)
                diskPies.updateData(result.cipan)
            }
        },

        init: function(showTrue) {
            showTrueLoader = showTrue
            utils.zoomIndex()
            centerBall = new CenterBall('.branch-circles')
            loadPies = new LoadPies()
            diskPies = new DiskPies()
            mainPageWs = utils.getData(api.isOnline, api.mainPage, null, Index.dealData)
            alarmWs = utils.getData(api.isOnline, api.alarm, null, Index.detachAlarmData)
            masterLoadWs = utils.getData(api.isOnline, api.masterLoad, null, Index.detachMasterLoadData)

            //时间轴选择界面
            date.initPicker('date', '.datePicker-trigger', 'mousemove', dateCallback)

            //日历按钮查询事件
            function dateCallback(startTime, endTime) {

                //关闭ws通讯
                if (mainPageWs) mainPageWs.close()
                if (alarmWs) alarmWs.close()
                if (masterLoadWs) masterLoadWs.close()

                //更新回调函数
                function callback(data) {
                    var result = data.result
                    centerBall.updateData(result.flow)
                }

                //请求数据
                utils.getData(api.isOnline, api.HOST + '/mainInterface/startTime/' + startTime + '/endTime/' + endTime + '', null, callback)

                //5分钟后恢复ws通讯，刷新数据
                setTimeout(function() {
                    mainPageWs = utils.getData(api.isOnline, api.mainPage, null, Index.dealData)
                    alarmWs = utils.getData(api.isOnline, api.alarm, null, Index.detachAlarmData)
                    masterLoadWs = utils.getData(api.isOnline, api.masterLoad, null, Index.detachMasterLoadData)
                }, 300000);
            }
        }
    }
    return Index
})