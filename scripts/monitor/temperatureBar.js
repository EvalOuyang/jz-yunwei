/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 动环监测温度柱状图
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('d3')
    require('handlebars')
    var svg = null
    var y = null
    var first = true
    var width = $('.temperature-bar').width()
    var height = $('.temperature-bar').height()
    var padding = { top: 100, bottom: 100, left: 130, right: 0 }


    /**
     * 初始化
     * @param {array} data 柱状图所需数据集
     */
    function init(data) {
        if (first) {
            initBars(data)
            first = false
        } else {
            update(data)
        }
    }

    /**
     * 初始化柱状图
     * @param {array} data 后台返回的结果集
     */
    function initBars(data) {
        var rectWidth = 32
        var rectStep = 115

        //获取svg对象
        svg = d3.select('.temperature-bar').select('svg')
        svg.attr({
            'width': width,
            'height': height
        })

        //定义y轴的线性比例尺
        y = d3.scale.linear()
            .range([0, height - padding.top - padding.bottom])
            .domain([0, d3.max(data, function(d) { return d.value; })])

        //加橫坐标轴
        var xAxisLines = svg.append("g").attr("class", "x axis")
        xAxisLines.append('path')
            .attr('d', 'M' + (padding.left) + ',' + (height - padding.bottom + 1) + ' H' + (width - padding.right) + '')
            .attr('stroke', '#52ccff')
            .attr('stroke-width', 1)

        //画背景上的四根横线
        for (var i = 0; i < 4; i++) {
            xAxisLines.append('path')
                .attr('d', 'M' + (padding.left) + ',' + (height - padding.bottom - (i + 1) * 50) + ' H' + (width - padding.right) + '')
                .attr('stroke', '#398692')
                .attr('stroke-width', 1)
        }

        //加柱状
        svg.append('g').attr('class', 'rects').selectAll("rect")
            .data(data)
            .enter().append("rect")
            .style("fill", function(d, i) {
                // if (d.value > 32 || d.value < 15) {
                //     return "url(#alarmGradient)"
                // } else {
                return "url(#normalGradient)"
                    // }
            })
            .attr("x", function(d, i) { return padding.left + rectStep * i })
            .attr("width", rectWidth)
            .attr("y", function(d) { return height - padding.bottom - y(d.value) })
            .attr("height", function(d) { return y(d.value); })
            .attr('transform', 'translate(20,0)')

        //加柱状顶部的文本标签
        svg.append('g').attr('class', 'number-label').selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr({
                'fill': '#fefefe',
                'font-size': 24,
                'text-anchor': 'middle',
                'x': function(d, i) {
                    return padding.left + rectStep * i
                },
                'y': function(d, i) {
                    return height - padding.bottom - y(d.value)
                },
                'dx': function(d, i) {
                    return rectWidth / 2
                },
                'dy': '-.5em',
                'transform': 'translate(20,0)'
            })
            .text(function(d, i) {
                return d.value
            })

        //加x轴标签
        svg.append('g').attr('class', 'axis-label').selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr({
                'fill': '#b1b1b1',
                'font-size': 20,
                'text-anchor': 'end',
                'x': function(d, i) {
                    return padding.left + rectStep * i
                },
                'y': function(d, i) {
                    return height - padding.bottom + 40
                },
                'dx': function(d, i) {
                    return rectWidth / 2
                },
                'dy': '-.8em',
                'transform': function(d, i) {
                    return 'translate(40,-10) rotate(-20 ' + (padding.left + rectStep * i + rectWidth) + ' ' + (height - padding.bottom + 40) + ')'
                }
            })
            .text(function(d, i) {
                return d.name
            })

        //加纵坐标标题
        var tittle = svg.append('g').attr('class', 'tittle')
        tittle.append('text')
            .attr({
                'fill': '#5e8fff',
                'font-size': 30,
                'x': 0,
                'y': 90
            })
            .text('温度')
        tittle.append('text')
            .attr({
                'fill': '#5e8fff',
                'font-size': 30,
                'x': 0,
                'y': 130
            })
            .text('℃')

        //加横坐标标题
        tittle.append('text')
            .attr({
                'fill': '#b1b1b1',
                'font-size': 30,
                'x': 24,
                'y': height - padding.bottom,
            })
            .text('机房')
    }


    /**
     * 更新柱状图
     * @param {array} data 后台返回的结果集
     */
    var rects
    var numberLabels
    var axisLabels

    function update(data) {
        //更新时要重新定义y轴值域
        y.domain([0, d3.max(data, function(d) { return d.value; })])

        //获取柱形集
        rects = svg.select('.rects')

        //获取所有柱形顶部的文本标签数据集
        numberLabels = svg.select('.number-label')

        //获取x轴标签数据集
        axisLabels = svg.select('.axis-label')

        //更新柱状图
        rects.selectAll("rect")
            .data(data)
            .style("fill", function(d, i) {
                // if (d.value > 32 || d.value < 15) {
                //     return "url(#alarmGradient)"
                // } else {
                return "url(#normalGradient)"
                    // }
            })
            .attr("y", function(d) { return height - padding.bottom - y(d.value) })
            .attr("height", function(d) { return y(d.value); })

        //更新柱状顶部的文本标签
        numberLabels.selectAll('text')
            .data(data)
            .attr({
                'y': function(d, i) {
                    return height - padding.bottom - y(d.value)
                },
            })
            .text(function(d, i) {
                return d.value
            })

        //更新x轴标签
        axisLabels.selectAll('text')
            .data(data)
            .text(function(d, i) {
                return d.name
            })
    }

    var result = {
        init: init,
        update: update
    }
    return result
})