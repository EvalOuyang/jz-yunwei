/*
 * @Author: yinbanghui
 * @Date:   2017-05-22 20:43:32
 * @Description: 磁盘状态
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-05-31 16:22:55
 */

define(function(require) {
    var tpl = require('../../components/diskHost/diskStatus.tpl')
    var template = Handlebars.compile(tpl);

    // 注册一个Handlebars Helper,用来将索引+1，因为默认是从0开始的
    Handlebars.registerHelper("addOne", function(index, options) {
        return parseInt(index) + 1;
    });

    var module = {
        /**
         * 磁盘状态业务逻辑
         *
         * @param {object} data 返回待处理数据
         */
        init: function(data) {
            var brokenPercent = 0
            var willBrokenPercent = 0
            data.total = data.total.toLocaleString()
            for (var i = 0, len = data.status.length; i < len; i++) {
                data.status[i].value = data.status[i].value.toLocaleString()
                if (data.status[i].name === "故障") {
                    brokenPercent = parseFloat(data.status[i].percent)
                }
                if(data.status[i].name === "即将损坏"){
                    willBrokenPercent = parseFloat(data.status[i].percent)
                }
            }

            data.statusList = []

            for (var i = 0; i < 100; i++) {
                data.statusList.push({
                    id: i,
                    type: "normal"
                })
            }
            
            var willBrokenCount = Math.floor(willBrokenPercent) + 1
            for (var i = 0; i < willBrokenCount; i++) {
                data.statusList[i].type = "willBroken"
            }
            
            var total = Math.floor(willBrokenPercent + brokenPercent)+1

            for (var j = willBrokenCount; j < total; j++) {
                data.statusList[j].type = "broken"
            }

            $('.diskStatus').html(template(data));

            // var willBrokenFloat = (willBrokenPercent - Math.floor(willBrokenPercent)) * 100 + '%'
            if(willBrokenPercent - Math.floor(willBrokenPercent) != 0){
                $('.diskStatus .diskInfo .chart ul li:nth-child('+ willBrokenCount +')').css({
                    'background':'linear-gradient(to right,#eb9602 50%, #fb4343 50%)'
                })
  
            }
            
            // var totalFloat = (willBrokenPercent + brokenPercent - Math.floor(willBrokenPercent + brokenPercent))*100 + '%'
            if(willBrokenPercent + brokenPercent - Math.floor(willBrokenPercent + brokenPercent) != 0 && total > 1){
                $('.diskStatus .diskInfo .chart ul li:nth-child('+total+')').css({
                    'background':'linear-gradient(to right,#fb4343 50%, #5e8fff 50%)'
                })
            }
            

        }
    }

    return module
})