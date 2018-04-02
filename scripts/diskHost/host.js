/*
 * @Author: yinbanghui
 * @Date:   2017-05-23 16:42:58
 * @Description: 主机设备性能Top5
 * @Last Modified by:   yinbanghui
 * @Last Modified time: 2017-06-09 16:35:53
 */

define(function(require) {

    require('d3')
    var tpl = require('../../components/diskHost/host.tpl')
    var template = Handlebars.compile(tpl);

    var Circle = function(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
    }

    function Host() {
        var svgs = d3.select('.hostList').selectAll('svg')
        for (var i = 0; i < 3; i++) {
            svgs.append('circle')
                .attr({
                    'fill': '#528cff',
                    'stroke-width': 2,
                    'stroke': '#526eff'
                })
        }
    }

    Host.prototype.updateData = function(data) {
        data = data.slice(0, 5)
        var maxCPU = d3.max(data, function(d, i) {
            return parseInt(d.list[0].value)
        })

        var maxChange = d3.max(data, function(d, i) {
            return parseInt(d.list[1].value)
        })

        var maxMemory = d3.max(data, function(d, i) {
            return parseInt(d.list[2].value)
        })
        var config = {
            maxCPU: maxCPU,
            maxChange: maxChange,
            maxMemory: maxMemory
        }

        // 获取size值，即value值大小，用于控制绘制三个相切圆的大小
        for (var i = 0, len = data.length; i < len; i++) {
            for (var j = 0, lenJ = data[j].list.length; j < lenJ; j++) {
                data[i].ip = data[i].list[3].value
                data[i].name = data[i].list[4].value
            }
            //清空d3之前绘制的图形
            $('#tangent' + (i + 1)).empty()

            drawCircles('#tangent' + (i + 1), data[i], config)
        }

        // 吞吐量、内存、GPU、IP地址
        $('.hostNameList').html(template(data));
    }

    function drawCircles(id, data, config) {
        var circleData = []
        var svg = d3.select(id)
        var a = svg.attr("width") - 8
        var r1 = parseFloat(data.list[1].value) * a / 400
        var r2 = parseFloat(data.list[2].value) * a / 400
        var r3 = parseFloat(data.list[0].value) * a / 400
        var x1 = a / 2 + r1
        var y1 = a / 2 - r1
        var x2 = a / 2 + r2
        var y2 = a / 2 - r1 + 2 * Math.sqrt(r1 * r2)
        var b = (Math.pow(x2, 2) - Math.pow(x1, 2) + Math.pow(y2, 2) - Math.pow(y1, 2) - Math.pow(r2 + r3, 2) + Math.pow(r1 + r3, 2)) / (2 * (y2 - y1))
        var k = (x1 - x2) / (y2 - y1)
        var x3 = y1 == y2 ? a / 2 - r3 : (k * y1 + x1 - k * b - Math.sqrt(Math.abs(Math.pow(k * b - x1 - k * y1, 2) - (Math.pow(k, 2) + 1) * (Math.pow(b, 2) + Math.pow(x1, 2) - 2 * b * y1 + Math.pow(y1, 2) - Math.pow(r1 + r3, 2))))) / (Math.pow(k, 2) + 1)
        var y3 = y1 == y2 ? y1 : k * x3 + b
        circleData.push(new Circle(x1, y1, r1))
        circleData.push(new Circle(x2, y2, r2))
        circleData.push(new Circle(x3, y3, r3))
        var update = svg.selectAll('circle').data(circleData)
        update.enter().append('circle')
        update.attr({
            'cx': function(d, i) {
                return d.x
            },
            'cy': function(d, i) {
                return d.y
            },
            'r': function(d, i) {
                return d.r
            },
            'fill': '#528cff',
            'fill-opacity': .5,
            'stroke-width': 2,
            'stroke': '#526eff'
        })
    }

    return Host
})