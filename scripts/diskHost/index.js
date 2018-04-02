/*
 * @Author: yinbanghui
 * @Date:   2017-05-18 10:58:15
 * @Description: 磁盘主机主文件js
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2018-02-05 09:26:12
 */

define(function(require) {

    var api = require('api.config')
    require('jquery')
    var utils = require('utils')
    require('handlebars')
    require('echarts')
    var date = require('date')

    var top5WS = null
    var diskStatusFailureWS = null
    var diskAlarmWS = null

    // 磁盘故障历史
    var diskFailure = require('../diskHost/diskFailure')
        // 磁盘状态
    var diskStatus = require('../diskHost/diskStatus')
        // 告警列表
    var diskAlarm = require('../diskHost/diskAlarm')
        // 网络设备
    var network = require('../diskHost/network')
        // 主机设备性能
    var Host = require('../diskHost/host')
    var host = null
    var index = {
        /**
         * 磁盘告警列表
         *
         * @param {object} 后端返回数据
         */
        diskAlarm: function(data) {
            diskAlarm.init(data.result.slice(0, 5))
        },
        /**
         * 磁盘状态、磁盘故障历史
         *
         * @param {object} 后端返回数据
         */
        diskStatusFailure: function(data) {
            var result = data.result
            diskStatus.init(result.diskStatus)
            diskFailure.init(result.diskFailure)
        },
        /**
         * 主机性能top5、网络设备性能top5
         *
         * @param {object} 后端返回数据
         */
        top5: function(data) {
            var result = data.result
            network.init(result.networkTOP5)
            host.updateData(result.hostTOP5)
        },
        /**
         * 页面初始化调用
         */
        init: function() {
            utils.zoomOther()
            host = new Host()
            top5WS = utils.getData(api.isOnline, api.top5, null, index.top5)
            diskStatusFailureWS = utils.getData(api.isOnline, api.diskStatusFailure, null, index.diskStatusFailure)
            diskAlarmWS = utils.getData(api.isOnline, api.diskAlarm, null, index.diskAlarm)

            //时间轴选择界面
            date.initPicker('month', '.datePicker-trigger', 'mousemove', dateCallback)

            //日历按钮查询事件
            function dateCallback(startTime, endTime) {

                endTime = new Date(endTime)
                endTime.setMonth(endTime.getMonth() + 1)
                var year = endTime.getFullYear()
                var month = endTime.getMonth() + 1
                month = month < 10 ? '0' + month : '' + month
                endTime = year + month

                //关闭ws通讯
                if (top5WS) top5WS.close()
                if (diskStatusFailureWS) diskStatusFailureWS.close()
                if (diskAlarmWS) diskAlarmWS.close()

                //更新回调函数
                function callback(data) {
                    var result = data.result
                    for (var i = 0, length = result.list.length; i < length; i++) {
                        result.list[i].value = result.list[i].value ? result.list[i].value : ''
                        result.list[i].percent = result.list[i].percent ? result.list[i].percent : ''
                    }
                    diskFailure.init(result)

                    //5分钟后恢复ws通讯，刷新数据
                    setTimeout(function() {
                        top5WS = utils.getData(api.isOnline, api.top5, null, index.top5)
                        diskStatusFailureWS = utils.getData(api.isOnline, api.diskStatusFailure, null, index.diskStatusFailure)
                        diskAlarmWS = utils.getData(api.isOnline, api.diskAlarm, null, index.diskAlarm)
                    }, 300000);
                }
                
                utils.getData(api.isOnline, api.HOST + '/diskHost/diskFailure/startTime/' + startTime + '/endTime/' + endTime + '', null, callback)
            }
        }
    }
    return index
})