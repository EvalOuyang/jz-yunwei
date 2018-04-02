/*
 * @Author: yinbanghui
 * @Date:   2017-05-24 15:49:50
 * @Description: 故障平台
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-06-09 16:29:16
 */

define(function(require) {

    var api = require('api.config')
    require('jquery')
    var utils = require('utils')
    require('handlebars')
    require('echarts')
    var date = require('date')

    var ws = null

    //新建变量
    var tpl
    var template

    // 故障概况
    var faultProfile = require('../troubleTable/faultProfile')
        // 故障类型
    var faultType = require('../troubleTable/faultType')
        // 有新的故障
    var newFault = require('../troubleTable/newFault')
        // 支队故障
    var detachFault = require('../troubleTable/detachFault')

    var index = {
        /**
         * 处理数据函数
         *
         * @param {object} 后端返回数据
         */
        dealData: function(data) {
            var result = data.result
            if (result.faultProfile) faultProfile.init(result.faultProfile)
            if (result.faultType) faultType.init(result.faultType)
            if (result.newFault) newFault.init(result.newFault)
            if (result.detachFault) detachFault.init(result.detachFault)
        },

        /**
         * 页面初始化
         *
         */
        init: function() {
            utils.zoomOther()
            ws = utils.getData(api.isOnline, api.troubleTable, null, index.dealData)

            // 时间轴选择界面
            date.initPicker('date', '.datePicker-trigger', 'mousemove', dateCallback)

            //日历按钮查询事件
            function dateCallback(startTime, endTime) {

                if (ws) ws.close()

                utils.getData(api.isOnline, api.HOST + '/troubleTable/startTime/' + startTime + '/endTime/' + endTime + '', null, index.dealData)
                
                setTimeout(function() {
                    ws = utils.getData(api.isOnline, api.troubleTable, null, index.dealData)
                }, 300000);
            }
        }
    }
    return index
})