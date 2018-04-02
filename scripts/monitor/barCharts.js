/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 动环监测温度柱状图
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('d3')

    /**
     * 初始化
     * @param {array} data 柱状图所需数据集
     */
    function BarCharts(config) {
        if (this instanceof BarCharts) {
            this.width = $(config.el).width()
            this.height = $(config.el).height()
            this.yaxisLabel = config.yaxisLabel
            this.yaxisUnit = config.yaxisUnit

            //获取svg对象
            this.svg = d3.select(config.el).select('svg')
            this.svg.attr({
                'width': this.width,
                'height': this.height
            })


            this.svg.append("g").attr("class", "x axis")
            this.svg.append('g').attr('class', 'rects')
            this.svg.append('g').attr('class', 'number-label')
            this.svg.append('g').attr('class', 'axis-label')
            this.svg.append('g').attr('class', 'tittle')

            //加橫坐标轴
            var xAxisLines = this.svg.select(".axis")
            xAxisLines.append('path')
                .attr('d', 'M' + (this.padding.left) + ',' + (this.height - this.padding.bottom + 1) + ' H' + (this.width - this.padding.right) + '')
                .attr('stroke', '#52ccff')
                .attr('stroke-width', 1)

            //画背景上的四根横线
            for (var i = 0; i < 4; i++) {
                xAxisLines.append('path')
                    .attr('d', 'M' + (this.padding.left) + ',' + (this.height - this.padding.bottom - (i + 1) * 50) + ' H' + (this.width - this.padding.right) + '')
                    .attr('stroke', '#398692')
                    .attr('stroke-width', 1)
            }

            //加纵坐标标题
            var tittle = this.svg.select('.tittle')
            tittle.append('text')
                .attr({
                    'fill': '#5e8fff',
                    'font-size': 30,
                    'x': 0,
                    'y': 90
                })
                .text(this.yaxisLabel)
            tittle.append('text')
                .attr({
                    'fill': '#5e8fff',
                    'font-size': 30,
                    'x': 0,
                    'y': 130
                })
                .text(this.yaxisUnit)

            //加横坐标标题
            tittle.append('text')
                .attr({
                    'fill': '#b1b1b1',
                    'font-size': 30,
                    'x': 24,
                    'y': this.height - this.padding.bottom,
                })
                .text('机房')
        } else {
            return new BarCharts(config)
        }
    }

    BarCharts.prototype = {
        contructor: BarCharts,
        updateData: updateData,
        rectWidth: 32,
        rectStep: 115,
        padding: { top: 100, bottom: 100, left: 130, right: 0 }
    }

    /**
     * 初始化柱状图
     * @param {array} data 后台返回的结果集
     */
    function updateData(data) {
        var rectWidth = this.rectWidth
        var rectStep = this.rectStep
        var height = this.height
        var svg = this.svg
        var padding = this.padding

        //定义y坐标的线性比例尺
        var y = d3.scale.linear()
            .range([0, height - padding.top - padding.bottom])
            .domain([0, d3.max(data, function(d) { return d.value; })])

        //加柱状
        var rectUpdate = svg.select('.rects').selectAll("rect").data(data)
        rectUpdate.enter().append("rect")
        rectUpdate
            .style("fill", function(d, i) {
                return "url(#normalGradient)"
            })
            .attr("x", function(d, i) { return padding.left + rectStep * i })
            .attr("width", rectWidth)
            .attr("y", function(d) { return height - padding.bottom - y(d.value) })
            .attr("height", function(d) { return y(d.value); })
            .attr('transform', 'translate(20,0)')

        //加柱形顶部的文本标签
        var labelUpdate = svg.select('.number-label').selectAll('text').data(data)
        labelUpdate.enter().append('text')
        labelUpdate
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
        var xaxisLabelUpdate = svg.select('.axis-label').selectAll('text').data(data)
        xaxisLabelUpdate.enter().append('text')
        xaxisLabelUpdate
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
    }

    return BarCharts
})