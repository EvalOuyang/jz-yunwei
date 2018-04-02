/**
 * @Author:      baizn
 * @DateTime:    2017-01-17 09:24:27
 * @Description: seajs配置文件
 * @Last Modified By:   baizn
 * @Last Modified Time:    2017-01-17 09:24:27
 */

seajs.config({
    alias: {
        handlebars: 'handlebars.js',

        //第三方库文件
        jquery: 'jquery.min.js',
        d3: 'd3.v3.min.js',
        d3v4: 'd3.v4.min.js',
        echarts: 'echarts.3.7.min.js',
        mock: 'mock.js',

        //自定义库
        centerBall: './centerBall.js',
        centerMergency: './centerMergency.js',
        alarmList: './alarmList.js',
        lianlu: './lianlu.js',
        loadPies: './loadPies.js',
        diskPies: './diskPies.js',

        'api.config': '../api.config.js',
        'date': '../util/datePicker.js',
        utils: '../util/util',
        tabs: '../../sea-modules/jQuery.rTabs.js',
        liMarquee: '../../sea-modules/jquery.liMarquee.js'
    }
})