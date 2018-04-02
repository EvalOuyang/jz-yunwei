/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 动环监测四大参数：温度、湿度、电流、电压
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('handlebars')
    var tpl = require('../../components/monitor/environmentParams.tpl')
    var template = Handlebars.compile(tpl)
    var specialRoom = '总队三亚湾机房'

    /**
     * 初始化
     * @param {array} data 后台返回的结果集
     */
    function init(data) {
        var currRoom = $('.leftBottom .jifang-selection').html()

        //遍历这四个参数对象，重新构造成渲染需要的对象
        for (var i = 0; i < data.length; i++) {
            switch (i) {
                //温度
                case 0:
                    if ((data[i].value > 32 || data[i].value < 15) && currRoom == specialRoom) {
                        data[i].iconUrl = 'url(../images/monitor/temperature_alarm.png) no-repeat'
                        data[i].textColor = '#fa4344'
                    } else {
                        data[i].iconUrl = 'url(../images/monitor/temperature.png) no-repeat'
                        data[i].textColor = '#fefefe'
                    }
                    data[i].unit = '℃'
                    break

                    //湿度
                case 1:
                    if ((data[i].value > 90 || data[i].value < 30) && currRoom == specialRoom) {
                        data[i].iconUrl = 'url(../images/monitor/humidity_alarm.png) no-repeat'
                        data[i].textColor = '#fa4344'
                    } else {
                        data[i].iconUrl = 'url(../images/monitor/humidity.png) no-repeat'
                        data[i].textColor = '#fefefe'
                    }
                    data[i].unit = '%'
                    break
                    //电压
                case 2:
                    if ((data[i].value > 250 || data[i].value < 200) && currRoom == specialRoom) {
                        data[i].iconUrl = 'url(../images/monitor/voltage_alarm.png) no-repeat'
                        data[i].textColor = '#fa4344'
                    } else {
                        data[i].iconUrl = 'url(../images/monitor/voltage.png) no-repeat'
                        data[i].textColor = '#fefefe'
                    }
                    data[i].unit = 'V'
                    break
                    //电流
                default:
                    data[i].iconUrl = 'url(../images/monitor/other.png) no-repeat'
                    data[i].textColor = '#fefefe'
                    data[i].unit = 'A'
            }
        }

        //渲染数据
        $('.environment-params').html(template(data))
    }

    /**
     * 重新获取数据后更新操作
     * @param {array} data 后台返回的结果集
     */
    function update(data) {
        init(data)
    }

    /**
     * 对外接口对象
     */
    var result = {
        init: init,
        update: update
    }
    return result

})