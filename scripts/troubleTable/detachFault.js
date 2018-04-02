/*
 * @Author: yinbanghui
 * @Date:   2017-05-26 13:54:44
 * @Description: 各支队故障
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-06-09 16:31:34
 */
define(function(require) {

    require('tabs')
    var util = require('../util/util.js')
    var tpl = require('../../components/troubleTable/detachFault.tpl')
    var template = Handlebars.compile(tpl);

    // 已处理、未处理最大值
    var already = []
    var unTreated = []

    // 数组分组
    var maxArray = {
        page1: [],
        page2: [],
        page3: [],
        page4: [],
        page5: [],
        page6: [],
        page7: []
    }

    // 前端分页
    var pageArray = []

    var module = {
        /**
         * 支队故障业务逻辑
         *
         * @param {object} data 返回待处理数据
         */
        init: function(data) {
            already = []
            unTreated = []

            // 已处理、未处理最大值
            for (var i = 0, len = data.length; i < len; i++) {
                already.push(data[i].already)
                unTreated.push(data[i].unTreated)
            }
            // 求最大值
            maxArray = [Math.max.apply(null, already), Math.max.apply(null, unTreated)]

            // 计算已处理、未处理柱状图高度
            for (var i = 0, len = data.length; i < len; i++) {
                data[i].alreadyLen = Math.ceil((data[i].already / Math.max.apply(null, maxArray)) * 70)
                data[i].unTreatedLen = Math.ceil((data[i].unTreated / Math.max.apply(null, maxArray)) * 70)
            }

            // 对数据进行分组
            pageArray.page1 = data.slice(0, 6)

            //改变data值
            data = pageArray

            // 渲染数据
            $('.detachFault').html(template(data));
        }

    }

    return module
})