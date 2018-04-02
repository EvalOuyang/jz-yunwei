/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 主页面紧急状况
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('handlebars')
    var tpl = require('../../components/mainInterface/newList.tpl')
    var template = Handlebars.compile(tpl);


    /**
     * 初始化，渲染
     * @param {array} data 紧急告警结果集数组
     */
    function init(data) {
        if (data.length == 0) {
            $('.mergency').hide()
        } else {
            $('.mergency').show()
            $('.gundong-text').html(template(data))
        }
    }
    var result = {
        init: init
    }
    return result
})