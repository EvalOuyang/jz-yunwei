/*
 * @Author: yinbanghui
 * @Date:   2017-05-26 09:47:41
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-06-07 09:53:42
 */
define(function(require) {
    //滚动效果
    require('liMarquee')
    var tpl = require('../../components/troubleTable/newFault.tpl')
    var template = Handlebars.compile(tpl);
    var module = {
        /**
         * 有新的故障
         *
         * @param {object} data 返回待处理数据
         */
        init: function(data) {

            // 渲染数据
            $('.newFault').html(template(data));

            $('.falut').liMarquee({
                direction: 'up',
                circular: false
            });
        }

    }
    return module
})