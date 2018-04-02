/*
 * @Author: yinbanghui
 * @Date:   2017-05-18 13:35:16
 * @Description: 接口API配置文件
 * @Last Modified by: ouyangdecai@hiynn.com
 * @Last Modified time: 2018-03-28 11:50:22
 */

define(function(require) {

    // true表示联调部署模式，false表示本地调试模式，
    var isOnline = false;

    var onlineApiHost = 'http://12.4.0.60:8080/jizhen-yunwei/yunwei';
    var onlineWsHost = 'ws://12.4.0.60:8080/jizhen-yunwei/yunwei';

    // 接口联调接口列表
    var api = {
        "HOST": onlineApiHost,
        // 线上线下标志
        "isOnline": isOnline,

        // 获取当前日期的年季月周
        'getTime': onlineWsHost + '/timewebsocket/common/time',
        'pushTime': onlineWsHost + '/timewebsocket/time',

        // 磁盘状态、磁盘故障历史
        'diskStatusFailure': onlineWsHost + '/diskHost/diskStatusFailure',
        // 告警列表
        'diskAlarm': onlineWsHost + '/diskHost/diskAlarm',
        // 主机性能TOP5、网络设备性能TOP5
        'top5': onlineWsHost + '/diskHost/top5',

        // 故障平台
        'troubleTable': onlineWsHost + '/troubleTable',

        //动环监控
        'monitor': onlineWsHost + '/monitor',
        //当前流量、总队及支队链路
        'mainPage': onlineWsHost + '/mainInterface/flow',
        //告警、紧急情况
        'alarm': onlineWsHost + '/mainInterface/alarm',
        //主机运行负载分布
        'masterLoad': onlineWsHost + '/mainInterface/masterLoad',
    };

    return api
})