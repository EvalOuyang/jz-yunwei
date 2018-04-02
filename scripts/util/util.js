/**
 * @Author:      baizn yinbanghui
 * @DateTime:    2017-01-17 09:24:27
 * @Description: 通用工具方法
 * @Last Modified By:   yinbanghui
 * @Last Modified Time:    2017-01-17 09:24:27
 */
define(function(require) {
    var constans = require('./constants')
    var x
    var y
    x = window.innerWidth / constans.PAGE_WIDTH
    y = window.innerHeight / constans.PAGE_HEIGHT

    var common = {
        zoomX: x,
        zoomY: y,
        /**
         * 主页缩放
         */
        zoomIndex: function() {
            x = window.innerWidth / constans.PAGE_WIDTH
            y = window.innerHeight / constans.PAGE_HEIGHT
            zoomX = x
            zoomY = y
            common.zoom()
                /**
                 * 当缩放页面后，进行相应的缩放
                 */
            window.addEventListener('resize', function() {
                common.zoomIndex()
            })
        },
        /**
         * 其他页面缩放
         */
        zoomOther: function() {
            x = window.innerWidth / constans.OTHER_WIDTH
            y = window.innerHeight / constans.OTHER_HEIGHT
            zoomX = x
            zoomY = y
            common.zoom()
                /**
                 * 当缩放页面后，进行相应的缩放
                 */
            window.addEventListener('resize', function() {
                common.zoomOther()
            })
        },
        /**
         * 按照比例缩放页面
         */
        zoom: function() {
            $('body').css('webkitTransform', 'scale(' + x + ',' + y + ')') /* for Chrome || Safari */
            $('body').css('msTransform', 'scale(' + x + ',' + y + ')') /* for Firefox */
            $('body').css('mozTransform', 'scale(' + x + ',' + y + ')') /* for IE */
            $('body').css('oTransform', 'scale(' + x + ',' + y + ')') /* for Opera */
        },
        /**
         * ajax请求通用函数
         *
         * @param {string} url url地址
         * @param {object} param  参数
         * @param {object} callback  回调函数
         */
        sendAjax: function(url, param, callback) {
            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                data: param,
                success: callback
            })
        },
        /**
         * WebSocket请求通用函数
         *
         * @param {string} url url地址
         * @param {object} param  参数
         * @param {object} callback  回调函数
         */
        sendWs: function(url, param, callback) {
            var ws = new WebSocket(url);
            ws.onopen = function() {
                ws.send(JSON.stringify(param));
            }
            ws.onmessage = callback

            //注册close事件，否则close方法不会生效
            ws.onclose = function() {}

            //离开页面关闭WebSocket
            window.onunload = function() {
                ws.close()
            };
            return ws
        },
        /**
         * 通用获取数据方法
         *
         * @param {Boolean} isOnline 线上线下地址判断
         * @param {string}  url  请求数据地址
         * @param {object} param  参数
         * @param {object} dealData  业务逻辑处理函数
         */
        getData: function(isOnline, url, param, dealData) {
            if (isOnline) {
                if (url.match(/ws:/g)) {
                    return common.sendWs(url, param, function(evt) {
                        dealData(JSON.parse(evt.data))
                    })
                } else {
                    common.sendAjax(url, param, function(data) {
                        dealData(data)
                    })
                }
            } else {
                common.sendAjax(url, param, function(data) {
                    dealData(data)
                })
            }
        },

        /**
         * 获取字符串长度的方法
         * @param {string} str 要计算的字符串
         */
        getStrLength: function(str) {
            var realLength = 0
            var len = str.length
            var charCode = -1
            for (var i = 0; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode >= 0 && charCode <= 128)
                    realLength += 1;
                else
                    realLength += 2;
            }
            return realLength;
        }
    }

    return common
})