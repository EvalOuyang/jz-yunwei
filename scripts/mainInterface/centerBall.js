/**
 * @Author:      Eric Ouyang
 * @DateTime:    2017-06-02 12:00
 * @Description: 运维主页绕环柱状图及当日最大流量、瞬时流量、延迟时间
 * @Last Modified By:   Eric Ouyang
 * @Last Modified Time:    2017-06-02 12:00
 */
define(function(require, module, exports) {
    require('d3')
    require('jquery')
    var svg = null
    var util = require('../util/util.js')
    var config = require('../api.config.js')
    var center = null
    var colors = ['#527bff', '#8a66e6'] //['#8c60f9', '#e582f8']
    var data = null
    var maxDelayTime = null
    var circleConfig = {
        rx: 2, //柱状x方向的圆角值
        ry: 2, //柱状y方向的圆角值
        rectWidth: 15, //柱状的宽度
        totalAngle: 344, //支队间角度的总和，360-totalAngle则表示第一组和最后一组之间的角度
        offsetAngle: (360 - 344) / 2, //第一组的偏移角度
        outerRadius: 630, //支队名称所在外层圆的半径
        offsetRadius: 240, //柱状图转成的圆与外层圆的半径差，即柱状的最大高度
        innerRadius: 348 //柱状组成的圆形的半径
    }
    var tpl = require('../../components/mainInterface/centerBall.tpl')
    var template = Handlebars.compile(tpl)

    /**
     * 初始化
     * @param {array} data 后台返回的结果集
     */
    function CenterBall(el) {
        svg = d3.select(el).select('svg')
        center = [797, 903]
        svg.append('g').attr('class', 'init-content')
        svg.append('g').attr('class', 'run-percent-line')
        svg.append('g').attr('class', 'curr-item')
        svg.append('g').attr('class', 'rects')
        svg.append('g').attr('class', 'marks')

        /************页面效果渲染方法调用 begin *************/
        drawItemTitle()
        renderInnerCircle()
        drawArc()
        drawAnimationDots()
        drawLeftTopAnimation()

        /************页面效果渲染方法调用 end ***************/
    }

    //将更新数据的方法挂载到原型对象上，以供外部调用更新数据
    CenterBall.prototype.updateData = getCircleData

    /**
     * 渲染左上角、瞬时流量、延迟时间标题
     */
    function drawItemTitle() {
        //渲染瞬时流量标题
        var initContent = svg.select('.init-content')
        initContent.append('image')
            .attr({
                'xlink:href': '../images/mainInterface/currItemBg.png',
                'height': 90,
                'width': 780,
                'x': 550,
                'y': 105
            })
        initContent.append('rect')
            .attr({
                'height': 30,
                'width': 15,
                'x': 820,
                'y': 100,
                'rx': 3,
                'ry': 3,
                'fill': colors[0]
            })
        initContent.append('text')
            .attr({
                'x': 850,
                'y': 100,
                'dy': 24,
                'font-size': 28,
                'fill': '#b2b2b2',
                'class': 'flow-title'
            })
            .style({
                'cursor': 'pointer'
            })
            .text('瞬时流量(Mbps)')
            .on('click', showList)

        //渲染延迟时间标题
        initContent.append('rect')
            .attr({
                'height': 30,
                'width': 15,
                'x': 1120,
                'y': 100,
                'rx': 3,
                'ry': 3,
                'fill': colors[1]
            })
        initContent.append('text')
            .attr({
                'x': 1150,
                'y': 100,
                'dy': 24,
                'font-size': 28,
                'fill': '#b2b2b2',
                'class': 'time-title'
            })
            .style({
                'cursor': 'pointer'
            })
            .text('延迟时间(ms)')
            .on('click', showList)

        //渲染左上角标题
        var totalFlow = svg.append('g').attr('class', 'total-flow').style('cursor', 'pointer')
        totalFlow.append('text')
            .attr({
                'x': 128,
                'y': 89,
                'fill': '#fec631',
                'text-anchor': 'start',
                'font-size': 32
            })
            .text('最大流量(Mbps)')

        totalFlow.append('text')
            .attr({
                'x': 128,
                'y': 176,
                'fill': 'white',
                'text-anchor': 'start',
                'font-size': 84,
                'font-weight': 700,
                'class': 'total-flow-number',
                'filter': 'url(#GaussianBlur)'
            })

    }

    /**
     * 
     * 点击“瞬时流量”和“延迟时间”分别列出所有支队对应的量
     */
    function showList() {
        //当前环的标题
        var self = d3.select(this)
        var name = self.text()
        var list = []

        var sortData = data.sort(function(a, b) {
            return self.attr('class') == 'flow-title' ? b.currFlow - a.currFlow : b.delayTime - a.delayTime
        })

        for (var i = 0, length = sortData.length; i < length; i++) {
            if (sortData[i].delayTime >= 3000) {
                sortData[i].delayTime = '断开'
            }
            var item = {}
            item.name = sortData[i].name
            item.value = self.attr('class') == 'flow-title' ? sortData[i].currFlow : sortData[i].delayTime
            list.push(item)
        }
        //显示列表需要的数据集
        var dataset = {
            name: name,
            list: list
        }

        //渲染列表模板
        $('.center').append(template(dataset))

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
    }

    /**
     * 设置内部旋转圈
     */
    function renderInnerCircle() {
        //中间十字架
        svg.append('image')
            .attr({
                'xlink:href': '../images/mainInterface/plus_icon.png',
                'height': 26,
                'width': 26,
                'x': center[0] - 13,
                'y': center[1] - 13
            })

        //内部顺时针旋转的圆
        var img = svg.append('image')
            .attr({
                'xlink:href': '../images/mainInterface/innerCircle.png',
                'height': 200,
                'width': 200,
                'x': center[0] - 100,
                'y': center[1] - 100
            })

        ! function() {
            img
                .transition()
                .duration(10000)
                .ease('linear')
                .attrTween("transform", rotTween)
                .each('end', arguments.callee)
        }()

        //动画回调函数
        function rotTween() {
            var i = d3.interpolate(0, 360);
            return function(t) {
                return "rotate(" + i(t) + " " + center[0] + " " + center[1] + ")";
            }
        }
    }

    /**
     * 请求中间柱状图数据并调用绘制柱状图方法
     * @param {object} dataset 数据集
     */
    function getCircleData(dataset) {

        var flows = dataset.list

        //存储筛选以后的结果集
        var realFlows = []

        //筛选掉延迟时间为3000的支队
        for (var i = 0, length = flows.length; i < length; i++) {
            if (flows[i].delayTime < 3000) {
                realFlows.push(flows[i])
            }
        }

        maxDelayTime = d3.max(realFlows, function(d, i) {
            return d.delayTime
        })

        // for (var i = 0, length = flows.length; i < length; i++) {
        //     if (flows[i].delayTime == 3000) {
        //         flows[i].delayTime = maxDelayTime
        //     }
        // }

        data = flows

        //调用绘制柱状、环上支队名称的方法
        drawBallCharts()
        drawLabels()

        //提取当前默认应该显示的支队，取当前流量最大的支队
        var currItem = flows[0]
        for (var i = 0; i < flows.length; i++) {
            if (flows[i].currFlow > currItem.currFlow) {
                currItem = flows[i]
            }
        }

        //渲染默认显示的支队
        updateCurrItem(currItem)

        //渲染当前总流量
        var todayMaxFlow = currItem.currFlow
        svg.select('.total-flow').select('.total-flow-number').text(todayMaxFlow)

    }


    /**
     * 画两段弧
     */
    function drawArc() {
        //画弧需要的数据集
        var data = [
            { startAngle: -Math.PI * 45 / 180, endAngle: Math.PI * 45 / 180 },
            { startAngle: Math.PI * 135 / 180, endAngle: Math.PI * 225 / 180 }
        ]

        //定义弧路径生成器
        var innerRadius = 337
        var outerRadius = 344
        var arcPath = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius)

        //添加弧路径
        var arcGroups = svg.append('g').attr('class', 'arcs')
        arcGroups.selectAll('path')
            .data(data)
            .enter()
            .append('path')
            .attr('d', arcPath)
            .attr('transform', 'translate(' + center[0] + ',' + center[1] + ')')
            .attr('stroke-width', 0)
            .attr('fill', '#6281D6')

        //定义弧逆时针旋转动画
        ! function arcAnimation() {
            arcGroups
                .attr('transform', 'rotate(0)')
                .transition()
                .ease('linear')
                .duration(10000)
                .attrTween("transform", rotTween)
                .each('end', arcAnimation)
        }()

        //动画回调函数
        function rotTween() {
            var i = d3.interpolate(0, -360);
            return function(t) {
                return "rotate(" + i(t) + " " + center[0] + " " + center[1] + ")";
            }
        }
    }
    /**
     * 画柱状图、支队名称、环上的三角形刻度
     * @param {array} data 画柱状图的数据集
     */
    function drawBallCharts() {
        //包含所有支队分组的g元素的d3对象
        var rects = svg.select('.rects')

        //更新集
        var update = rects.selectAll('g').data(data, function(d, i) {
            return d.id
        })

        //缺省集
        var enter = update.enter().append('g').attr('data-id', function(d) {
            return d.id
        })

        //多余集，删除
        update.exit().remove()

        //缺省集属性设置
        enter.append('text').attr('class', 'name')
        enter.append('path').attr('class', 'triangle')
        enter.append('rect').attr('class', 'max-flow')
        enter.append('rect').attr('class', 'delay-time')

        //更新集属性设置
        update.select('.name').call(nameAttr)
        update.select('.triangle').call(triangleAttr)
        update.select('.max-flow').call(flowRectAttr)
        update.select('.delay-time').call(delayRectAttr)

    }

    /**
     * 设置支队名称属性
     * 
     */
    function nameAttr() {
        var initColor = '#5e8fff'
        this.attr({
                'filter': 'url(#GaussianBlur)',
                'fill': function(d, i) {
                    return d.delayTime >= 3000 ? 'red' : initColor
                },
                'font-size': 26,
                'font-weight': 700,
                'font-family': 'Microsoft YaHei',
                'text-anchor': function(d, i) {
                    var angle = circleConfig.totalAngle * i / (data.length - 1) + circleConfig.offsetAngle

                    //位于中轴线两侧10度以内的名称居中对齐
                    if ((angle > 170 && angle < 190) || angle > 350 || angle < 10) {
                        return 'middle'
                    }
                    if (angle > 180) { //左边的支队名称尾部对齐
                        return 'end'
                    } else { //右边的支队名称头部对齐
                        return 'start'
                    }
                },
                'data-currFlow': function(d, i) {
                    return d.currFlow
                },
                'data-delayTime': function(d, i) {
                    return d.delayTime
                },

                'x': function(d, i) {
                    var posX = center[0] + circleConfig.outerRadius * Math.sin((circleConfig.totalAngle * i / (data.length - 1) + circleConfig.offsetAngle) * Math.PI / 180)
                    return posX
                },
                'y': function(d, i) {
                    var posY = center[1] - circleConfig.outerRadius * Math.cos((circleConfig.totalAngle * i / (data.length - 1) + circleConfig.offsetAngle) * Math.PI / 180)
                    return posY
                },
                'dy': function(d, i) {
                    /**
                     * 以抛物线公式计算支队名称的垂直偏移量。
                     * 由于d3文本排列方式是文本左上角位于x、y指定的位置处，
                     * 那么由于文本的高度关系，越位于底部的文本离圆轨迹太远，所以需要微调。
                     * 抛物线公式：y^2=-2px
                     */
                    var textHeight = 20 //文本高度
                    var angle = (circleConfig.totalAngle * i / (data.length - 1) + circleConfig.offsetAngle) * Math.PI / 180
                    var scale = -Math.pow(angle, 2) / Math.pow(Math.PI, 2) + 2 * angle / Math.PI
                    return scale * 20
                },
                'class': 'name'
            })
            .style({
                'cursor': 'pointer'
            })
            .text(function(d, i) {
                return d.name
            })
            .on('click', function(d, i) {
                var _this = d3.select(this)
                    // if (d.delayTime >= 3000) return

                //将所有支队名称改为正常状态
                d3.select('.rects').selectAll('.name').attr({
                    'filter': 'url(#GaussianBlur)',
                    'fill': function(d, i) {
                        return d.delayTime >= 3000 ? 'red' : initColor
                    }

                })

                //修改当前点击的支队名称为高亮、白色
                _this.attr({
                    'fill': '#d9e5ff',
                    'filter': 'url(#GaussianBlur)'
                })

                //修改顶部显示为当前点击的支队的信息
                var name = _this.text()
                var currFlow = _this.attr('data-currFlow')
                var delayTime = _this.attr('data-delayTime')
                delayTime = delayTime >= 3000 ? '断开' : delayTime
                updateCurrItem({
                    name: name,
                    currFlow: currFlow,
                    delayTime: delayTime,
                })
            })
    }

    /**
     * 设置倒三角属性
     * 
     */
    function triangleAttr() {
        this.attr({
            'd': drawTriangle,
            'transform': function(d, i) {
                return 'rotate(' + (circleConfig.totalAngle * i / (data.length - 1) + circleConfig.offsetAngle) + ',' + center[0] + ',' + center[1] + ')'
            },
            'stroke-width': 2,
            'stroke': '#6881fb',
            'fill': 'transparent',
            'class': 'triangle'
        })
    }

    /**
     * 设置瞬时流量柱状的属性
     * 
     */
    function flowRectAttr() {
        //最大流量
        var maxFlow = d3.max(data, function(d, i) {
            return d.currFlow
        })
        this.attr({
                'transform': function(d, i) {
                    return 'rotate(' + (circleConfig.totalAngle * i / (data.length - 1) + circleConfig.offsetAngle) + ' ' + center[0] + ' ' + center[1] + ') translate(' + center[0] + ',' + (center[1] - circleConfig.innerRadius) + ')'
                },
                'x': function(d, i) {
                    return -circleConfig.rectWidth
                },
                'y': function(d, i) {
                    return maxFlow ? -d.currFlow * circleConfig.offsetRadius / maxFlow : 0
                },
                'height': function(d, i) {
                    return maxFlow ? d.currFlow * circleConfig.offsetRadius / maxFlow : 0
                },
                'fill': colors[0],
                'data-name': function(d, i) {
                    return d.name
                },
                'data-tittle': "瞬时流量",
                'data-value': function(d, i) {
                    return d.currFlow
                },
                'rx': circleConfig.rx,
                'ry': circleConfig.ry,
                'width': circleConfig.rectWidth,
                'class': 'max-flow'
            })
            .on('mouseover', branchRectMouseover)
            .on('mouseout', branchRectMouseout)
    }

    /**
     * 设置延迟时间柱状的属性
     * 
     */
    function delayRectAttr() {
        this.attr({
                'transform': function(d, i) {
                    return 'rotate(' + (circleConfig.totalAngle * i / (data.length - 1) + circleConfig.offsetAngle) + ' ' + center[0] + ' ' + center[1] + ') translate(' + center[0] + ',' + (center[1] - circleConfig.innerRadius) + ')'
                },
                'x': 2,
                'y': function(d, i) {
                    var delayTime = d.delayTime >= 3000 ? maxDelayTime : d.delayTime
                    return maxDelayTime ? -delayTime * circleConfig.offsetRadius / maxDelayTime : 0
                },
                'height': function(d, i) {
                    var delayTime = d.delayTime >= 3000 ? maxDelayTime : d.delayTime
                    return maxDelayTime ? delayTime * circleConfig.offsetRadius / maxDelayTime : 0
                },
                'fill': colors[1],
                'data-name': function(d, i) {
                    return d.name
                },
                'data-tittle': "延迟时间",
                'data-value': function(d, i) {
                    return d.delayTime
                },
                'rx': circleConfig.rx,
                'ry': circleConfig.ry,
                'width': circleConfig.rectWidth,
                'class': 'delay-time'
            })
            .on('mouseover', branchRectMouseover)
            .on('mouseout', branchRectMouseout)
    }


    /**
     * 柱状鼠标移入事件
     * 
     */
    function branchRectMouseover() {
        var pageX = d3.event.pageX
        var pageY = d3.event.pageY
        var tooltip = d3.select('body').append('div')
            .attr({
                'class': 'tooltip'
            })
            .style({
                'left': pageX / util.zoomX - 50 + 'px',
                'top': pageY / util.zoomY - 100 + 'px'
            })
        var name = d3.select(this).attr('data-name')
        var tittle = d3.select(this).attr('data-tittle')
        var value = d3.select(this).attr('data-value')
        tooltip.append('div').html(name + '：' + tittle)
        tooltip.append('div').html(value)
    }

    /**
     * 柱状鼠标移出事件
     * 
     */
    function branchRectMouseout() {
        d3.select('.tooltip').remove()
    }

    /**
     *倒三角路径生成
     */
    function drawTriangle() {
        //加三角形样式的刻度
        var linePath = d3.svg.line()
            .x(function(d, i) {
                return d[0]
            })
            .y(function(d, i) {
                return d[1]
            })

        var triangleData = []
        var a = 12 //三角形边长
        var distance = 595 //三角形距离圆心的距离
        var posX = center[0] //三角形顶点的x坐标
        var posY = center[1] - distance //三角形顶点的y坐标

        //构造画三角形需要的数据集
        triangleData.push([posX, posY])
        triangleData.push([posX - a * Math.cos(Math.PI / 4), posY - a * Math.sin(Math.PI / 4)])
        triangleData.push([posX + a * Math.cos(Math.PI / 4), posY - a * Math.sin(Math.PI / 4)])
        triangleData.push([posX, posY])
        return linePath(triangleData)
    }

    /**
     * 画中轴线左右两侧的标签
     */
    function drawLabels() {
        var outerRadius = 348 //刻度到达的外圆的半径
        var innerRadius = 51 //刻度开始的内圆的半径 
        var flowMarkData = []
        var delayTimeMarkData = []

        //计算最大流量、最大延迟时间
        var maxFlow = d3.max(data, function(d, i) {
            return d.currFlow
        })

        // var maxDelayTime = d3.max(data, function(d, i) {
        //     return d.delayTime
        // })

        //构造标签数据集
        for (var i = 1; i <= 4; i++) {
            flowMarkData.push({ x: center[0], y: center[1] - outerRadius - innerRadius * i, text: Number(i * maxFlow / 5).toFixed(1) })
            delayTimeMarkData.push({ x: center[0], y: center[1] - outerRadius - innerRadius * i, text: Number(i * maxDelayTime / 5).toFixed(1) })
        }

        //加单位
        flowMarkData.push({ x: center[0], y: 320, text: '(Mb)' })
        delayTimeMarkData.push({ x: center[0], y: 320, text: '(ms)' })

        //当前流量维度的刻度标签
        var flowMarksUpdate = svg.select('.marks').selectAll('.flow-mark').data(flowMarkData)
        flowMarksUpdate.enter().append('text').attr('class', 'flow-mark')
        flowMarksUpdate.exit().remove()
        flowMarksUpdate
            .attr({
                'x': function(d) {
                    return d.x
                },
                'y': function(d, i) {
                    return d.y
                },
                'dx': -5,
                'fill': '#fefefe',
                'font-size': 26,
                'text-anchor': 'end'
            })
            .text(function(d) {
                return d.text
            })

        //延迟时间维度的刻度标签
        var delayMarksUpdate = svg.select('.marks').selectAll('.delayTime-mark').data(delayTimeMarkData)
        delayMarksUpdate.enter().append('text').attr('class', 'delayTime-mark')
        delayMarksUpdate.exit().remove()
        delayMarksUpdate.attr({
                'x': function(d) {
                    return d.x
                },
                'y': function(d, i) {
                    return d.y
                },
                'dx': 5,
                'fill': '#fefefe',
                'font-size': 26,
                'text-anchor': 'start'
            })
            .text(function(d) {
                return d.text
            })
    }

    /**
     * 画中心向外扩散的动态点
     */
    function drawAnimationDots() {
        //散列点初始化时起点所在的内圆半径
        var startRadius = 120

        //散列点消失时终点所在的外圆半径
        var endRadius = 330
        var dots = svg.append('g').attr('class', 'animation-dots')
        for(var i = 0; i < 40; i++){
            dots.append('circle').attr('class','circle'+i)
            var dot = dots.select('.circle' + i)
            animateDot(dot)
        }
        function animateDot(dot) {
            var random = Math.random()
            var angle = 360 * random
            dot
                .attr({
                    'cx': 0,
                    'cy': 0,
                    'r': 3,
                    'fill': '#e0f7fd',
                    'opacity': 0,
                    'transform': 'rotate(' + angle + ' ' + center[0] + ' ' + center[1] + ') translate( ' + center[0] + ',' + (center[1] - startRadius) + ')'
                })
                .transition()
                .duration(4000)
                .delay(4000 * Math.random())
                .ease('linear')
                .attr('transform', 'rotate(' + angle + ' ' + center[0] + ' ' + center[1] + ') translate(' + center[0] + ',' + (center[1] - endRadius) + ')')
                .attr('opacity', 0)
                .each('start',function(){
                    d3.select(this)
                        .attr('opacity', 1)
                })
                .each('end', function(d,i){
                    animateDot(d3.select(this))
                })
        }
    }

    /**
     * 渲染当前最大流量、平均流量、运行百分比
     * @param {object} data 数据集
     */
    function updateCurrItem(data) {
        var currDataInfo = svg.select('.curr-item')
        if (currDataInfo.selectAll('text').size() == 0) {

            //添加当前支队名称
            currDataInfo.append('text').attr('class', 'curr-branchName')
                .attr({
                    'x': 650,
                    'y': 170,
                    'font-size': 34,
                    'fill': 'white',
                    'text-anchor': 'middle'
                })
                .style({
                    'letter-spacing': '8px'
                })
                .text(data.name)

            //添加当前流量 
            currDataInfo.append('text').attr('class', 'curr-currFlow')
                .attr({
                    'x': 870,
                    'y': 175,
                    'font-size': 40,
                    'fill': 'white',
                    'filter': 'url(#GaussianBlur)'
                })
                .text(data.currFlow)

            //添加延迟时间
            currDataInfo.append('text').attr('class', 'curr-delayTime')
                .attr({
                    'x': 1150,
                    'y': 175,
                    'font-size': 40,
                    'fill': 'white',
                    'filter': 'url(#GaussianBlur)'
                })
                .text(data.delayTime)

        } else {
            currDataInfo.select('.curr-branchName').text(data.name)
            currDataInfo.select('.curr-currFlow').text(data.currFlow)
            currDataInfo.select('.curr-delayTime').text(data.delayTime)
        }
    }

    /**
     * 绘制左上角动效
     */
    function drawLeftTopAnimation() {
        //画两条上下运动的曲线
        var linePath = d3.svg.line()
            .x(function(d, i) {
                return d[0]
            })
            .y(function(d, i) {
                return d[1]
            })
            .interpolate('cardinal')

        var randomLineDots = svg.append('g').attr('class', 'random-lines-dots')

        //画两条动态曲线
        for (var i = 0; i < 2; i++) {
            drawOneLine(randomLineDots, linePath)
        }

        //画散点，并动画
        for(var i = 0;i < 20; i++){
            var dot = randomLineDots.append('circle')
            aDot(dot)
        }
    }

    /**
     * 画一条左上角的动画曲线
     * @param {object} randomLineDots 包含曲线和点的g对象
     * @param {object} linePath 生成曲线要用到的路径生成器
     */
    function drawOneLine(randomLineDots, linePath) {
        var line = randomLineDots.append('path')
            .attr({
                'filter': 'url(#GaussianBlur)',
                'stroke': '#b2943f',
                'stroke-width': 3,
                'fill': 'transparent',
                'opacity': .5,
                'd': function() {
                    return linePath(structLineDots())
                }
            });

        (function animationLine() {
            line.transition()
                .duration(2000)
                .ease('linear')
                .attr('d', function() {
                    var dots = structLineDots()
                    return linePath(dots)
                })
                .each('end', animationLine)
        })()
    }

    /**
     * 返回一组点，画左上角动画曲线的时候使用，4个点，最后一个点的位置始终是不变的
     */
    function structLineDots() {
        var dots = []
        for (var i = 0; i < 3; i++) {
            var dot = []
            var random = Math.random()
            dot.push(i * 33 + 9)
            dot.push(77 + 94 * random)
            dots.push(dot)
        }
        dots.push([105, 120])
        return dots
    }

    /**
     * 左上角产生一个点，并指定它的动画
     * @param {object} parentNode 要添加点的父元素
     */
    function aDot(dot) {
        var random = Math.random()
        dot
            .attr({
                'cx': 105,
                'cy': 120,
                'r': 5,
                'opacity': 0,
                'fill': '#ffe398',
                'transform': 'rotate(' + (45 + random * 90) + ' 105 120)'
            })
            .transition()
            .duration(3000)
            .delay(3000 * Math.random())
            .ease('linear')
            .attr({
                'transform': 'rotate(' + (45 + random * 90) + ' 105 120) translate(0,90)',
                'opacity': .1,
                'r': 2
            })
            .each('start',function(){
                d3.select(this)
                    .attr('opacity', 1)
            })
            .each('end', function(){
                aDot(d3.select(this))
            })
    }

    /**
     * 外部调用更新数据接口
     */
    function updateData() {
        runPercentLine(center)
        drawCurrItem()
        getCircleData(center)
    }

    /**
     * 返回结果对象
     */
    return CenterBall
})