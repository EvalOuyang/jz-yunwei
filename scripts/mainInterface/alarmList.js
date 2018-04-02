/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 主页面告警列表
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('handlebars')
    require('jquery')
    var util = require('../util/util.js')
    var config = require('../api.config.js')
    var alarmTpl = require('../../components/mainInterface/alarm.tpl')
    var alarmTemplate = Handlebars.compile(alarmTpl)
    var detailTpl = require('../../components/mainInterface/detailAlarmList.tpl')
    var detailTemplate = Handlebars.compile(detailTpl)

    /**
     * 初始化
     * @param {array} data 后台返回的数据集
     */
    function init(data) {
        var total = 0
        for (var i = 0; i < data.length; i++) {
            total += data[i].value
            data[i].total -= data[i].value
        }
        $('.alarm-total-number').html(total)
        $('.alarm-list').html(alarmTemplate(data))

        $.each($('.center .alarm .alarm-item'), function() {
            //2：表示告警类型的标题字数超过2个，就要增加其宽度，否则会换行
            if ($(this).find('.alarm-title').text().length > 2) {
                $(this).css({ 'width': '120px' })
            }
        })

        $('.alarm-list .alarm-value').off().on('click', function() {
            var index = $(this).parent().index()
            var name = $(this).prev('.alarm-title').text()
            var detailList = data[index].detailList
            if (detailList.length == 0) return
            var detailData = {
                name: name,
                list: detailList
            }

            //渲染列表模板
            $('.center').append(detailTemplate(detailData))

            //列表模态框淡出
            $('.monitor-list-container').fadeIn(300)

            //绑定点击背景空白处，模态框隐藏的事件
            $('.monitor-list-container').off().on('click', function(e) {
                if ($(e.target).hasClass('monitor-list-container') || $(e.target).hasClass('close-monitor')) {
                    $('.monitor-list-container').fadeOut(300, function() {
                        $('.monitor-list-container').remove()
                    })
                }
            })
        })

    }
    var result = {
        init: init
    }
    return result
})