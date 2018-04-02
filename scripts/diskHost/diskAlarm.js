/*
 * @Author: yinbanghui
 * @Date:   2017-05-22 20:57:03
 * @Description: 告警列表
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-05-31 16:09:27
 */

define(function(require) {
    var util = require('../util/util.js')
    var alarmList = require('../../components/diskHost/alarmList.tpl')
    var alarmListTemplate = Handlebars.compile(alarmList);

    var module = {
        /**
         * 磁盘告警列表业务逻辑
         *
         * @param {object} data 返回待处理数据
         */
        init: function(data) {
            $('.alarmList').html(alarmListTemplate(data));
            bindEvent()
        }
    }

    /**
     * 事件绑定，为显示不完全的内容加提示框
     */
    var bindEvent = function() {
        $('.alarmList .title').off().on('mouseover', function(e) {
            var text = $(this).text()
            if (util.getStrLength(text) > 44) {
                var tooltip = '<div class="tooltip">'
                tooltip += text
                tooltip += '</div>'
                $(this).append(tooltip)
                var pageX = $('.tooltip').width()
                var pageY = $('.tooltip').height()
                $('.tooltip').css({
                    'top': -(pageY + 20) + 'px',
                    'left': 0
                })
            }
        })
        $('.alarmList .title').on('mouseout', function(e) {
            $('.tooltip').remove()
        })
    }

    return module
})