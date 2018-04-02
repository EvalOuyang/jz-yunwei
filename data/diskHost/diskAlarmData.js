define(function(require) {
    require('mock')
    Mock.mock('ws://12.4.0.60:8080/jizhen-yunwei/yunwei/diskHost/diskAlarm', {
        "code": 1,
        "msg": "success",
        "result|5": [{
            "title": "硬盘192.10.0.5移动信令采集错移动信令采集动信令采集错移动信",
            "time": "@natural(0,24):@natural(0,6)@natural(0,9)"
        }]
    })
})