/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 主页面总队传输链路
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('jquery')
    require('handlebars')
    var util = require('../util/util.js')
    var config = require('../api.config.js')
    var tpl = require('../../components/mainInterface/lianluItem.tpl')
    var template = Handlebars.compile(tpl)

    //条形图可用的最大宽度
    var barRealWidth = 400

    /**
     * 初始化
     * @param {array} data 后台返回的数据集
     */
    function init(data) {
        var total = data.total
        var branch = data.branch
        var max = 0

        //获取结果集中的最大流量存在max中，后面用来计算流量条形的实际宽度
        for (i = 0, length = branch.length; i < length; i++) {
            if (branch[i].flow > max) {
                max = branch[i].flow
            }
        }

        //重新构建结果集，将branch集构造成handlebars模板需要的结构
        for (j = 0, len = branch.length; j < len; j++) {
            //width1：表示流量条形实际宽度
            branch[j].width1 = parseFloat(branch[j].flow) * barRealWidth / parseFloat(max)

            //width2：表示带宽占比条形的实际宽度，100：表示最大占比为100%
            var width2 = parseFloat(branch[j].bandWidth)
            branch[j].width2 = Math.round(width2 * barRealWidth / 100, 1)

            //branch[j].flow = branch[j].flow.toString()
            if (parseInt(branch[j].status)) {
                branch[j].className = 'route-title route-title-out'
            } else {
                branch[j].className = 'route-title route-title-in'
            }
        }
        //构建各机房的流量、带宽占比并渲染
        $('.route-list').html(template(branch))

        //渲染当前总流量、带宽占比
        $('.total-route').find('.total-item:nth-child(1)').find('.value').text(total.flow)
        $('.total-route').find('.total-item:nth-child(2)').find('.value').text(total.bandWidth)
    }
    var result = {
        init: init
    }
    return result
})