/*
 * @Author: yinbanghui
 * @Date:   2017-05-24 15:54:02
 * @Description: 故障概况
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-05-27 14:14:33
 */

define(function(require) {
    var tpl = require('../../components/troubleTable/faultProfile.tpl')
    var template = Handlebars.compile(tpl);
    var module = {
        /**
         * 故障概况业务逻辑
         *
         * @param {object} data 返回待处理数据
         */
        init: function(data) {
            // 超过三位每隔三位添加","
            for (var i = 0, len = data.length; i < len; i++) {
                data[i].value = data[i].value.toLocaleString()
            }
            // 渲染数据
            $('.faultProfile').html(template(data));
        }

    }
    return module
})