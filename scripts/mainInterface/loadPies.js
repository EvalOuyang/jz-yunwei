/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 16:00
 * @Description: 主页面主机运行负载分布
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 16:00
 */
define(function(require) {
    require('d3')
    require('jquery')
    require('handlebars')
    var util = require('../util/util.js')
    var config = require('../api.config.js')
    var svg = null

    //定义弧生成器
    var arc = d3.svg.arc()
        .innerRadius(50)
        .outerRadius(65)

    var tpl = require('../../components/mainInterface/monitorList.tpl')
    var template = Handlebars.compile(tpl)

    //相邻两个环图的中心点的距离
    var distance = 208

    //圆半径
    var r = 72

    /**
     * 初始化
     * @param {array} data 柱状图所需数据集
     */
    function LoadPies() {
        //获取svg对象
        svg = d3.select('.pie-container').select('svg')

        svg.append('g').attr('class', 'load-pies')
    }

    /**
     * 更新数据
     * @param {array} data 数据集
     */
    LoadPies.prototype.updateData = function(data) {

        //total用来存储主机总台数，用以计算各类型主机所占总台数的百分比
        var total = 0
        for (var i = 0, length = data.length; i < length; i++) {
            total += data[i].value
        }

        //构造画环图需要的数据格式的数据集，存在dataset中
        var dataset = []
        for (var i = 0, length = data.length; i < length; i++) {
            var dataItem = { startAngle: 0, endAngle: 2 * Math.PI * data[i].value / total, value: data[i].value, name: data[i].name, list: data[i].list }
            dataset.push(dataItem)
        }
        //调用画环的方法
        drawPies(dataset, '.load-pies')
    }

    /**
     * 画单个饼图
     * @param {array} dataset 画饼图所需的数据集
     */
    function drawPies(dataset, dom) {


        //获取更新数据集，注：data的第二个参数可以保证下次更新的时候以数据项的某个属性为标识顺序匹配
        var update = svg.select(dom).selectAll('g').data(dataset, function(d, i) { return d.name })

        //获取缺少数据集
        var enter = update.enter()

        //获取多余数据集并删除
        update.exit().remove()

        //为一个环图单独创建一个分组，然后将其余的渲染放在这个分组下，结构更清晰
        var pie = enter.append('g')
            .attr('class', 'load-pie-item')
            .style({ 'cursor': 'pointer' })

        //画最外层的圆
        pie.append('circle')
            .attr({
                'cx': function(d, i) {
                    return r + i * distance
                },
                'cy': r - 2,
                'r': r - 2,
                'stroke': '#5e8fff',
                'stroke-width': 2,
                'fill': 'transparent'
            })

        //画弧
        pie.append('path')
            .attr({
                'd': arc,
                'transform': function(d, i) {
                    return 'translate(' + (r + i * distance) + ',' + r + ')'
                },
                'fill': '#5e8fff'
            })

        //添加环中间的数据，台数
        pie.append('text')
            .attr({
                'x': function(d, i) {
                    return r + i * distance
                },
                'y': r,
                'dy': 10,
                'text-anchor': 'middle',
                'fill': '#fefefe',
                'font-size': 36,
                'class': 'pie-value'
            })
            .text(function(d, i) {
                return d.value
            })

        //加“台”字
        pie.append('text')
            .attr({
                'x': function(d, i) {
                    return r + i * distance
                },
                'y': r,
                'dy': 40,
                'text-anchor': 'middle',
                'fill': '#5e8fff',
                'font-size': 26

            })
            .text('台')

        //加环下面的标题，如“40%以下”
        pie.append('text')
            .attr({
                'x': function(d, i) {
                    return r + i * distance
                },
                'y': r,
                'dy': 110,
                'text-anchor': 'middle',
                'fill': '#5e8fff',
                'font-size': 26,
                'class': 'item-name'

            })
            .text(function(d, i) {
                return d.name
            })



        //更新弧的长度
        update.select('path')
            .attr('d', arc)

        //更新中间的台数
        update.select('.pie-value')
            .text(function(d, i) {
                return d.value
            })

        bindPieClickEvent(pie)
    }

    /**
     * 添加环图点击事件
     * @param {object} pie 要绑定事件的环对象
     */
    function bindPieClickEvent(pie) {
        pie.on('click', function(d, i) {

            //当前环的标题
            var name = d3.select(this).select('.item-name').text()

            //显示列表需要的数据集
            var data = {
                name: name,
                list: d.list
            }

            //对主机列表排序
            data.list.sort(function(a, b) { return parseInt(b.CPU) - parseInt(a.CPU) })

            //渲染列表模板
            $('.center').append(template(data))

            //列表模态框淡出
            $('.monitor-list-container').fadeIn(300)

            //绑定点击背景空白处，模态框隐藏的事件
            $('.monitor-list-container').on('click', function(e) {
                if ($(e.target).hasClass('monitor-list-container') || $(e.target).hasClass('close-monitor')) {
                    $('.monitor-list-container').fadeOut(300, function() {
                        $('.monitor-list-container').remove()
                    })
                }
            })
        })
    }

    return LoadPies
})