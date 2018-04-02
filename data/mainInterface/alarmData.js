define(function(require) {
    require('mock')
    Mock.mock('ws://12.4.0.60:8080/jizhen-yunwei/yunwei/mainInterface/alarm', {

        "code": "1",
        "msg": "success",
        "result": {
            "alarm": [{
                "name": "主机",
                "value|7-15": 12,
                "total|15-200": 24,
                "detailList|5-10": [{
                    "alarmTime": "2017年5月23日",
                    "ip": "120.4.@natural(0,255).@natural(0,255)",
                    "alarmContext": '@cparagraph(2,3)'
                }]
            }, {
                "name": "网络设备",
                "value|7-15": 12,
                "total|15-200": 24,
                "detailList|5-10": [{
                    "alarmTime": "2017年5月23日",
                    "ip": "120.4.@natural(0,255).@natural(0,255)",
                    "alarmContext": '@cparagraph(2,3)'
                }]
            }, {
                "name": "链路",
                "value|7-15": 12,
                "total|15-200": 24,
                "detailList|5-10": [{
                    "alarmTime": "2017年5月23日",
                    "ip": "120.4.@natural(0,255).@natural(0,255)",
                    "alarmContext": '@cparagraph(2,3)'
                }]
            }, {
                "name": "动环",
                "value|7-15": 12,
                "total|15-200": 24,
                "detailList|5-10": [{
                    "alarmTime": "2017年5月23日",
                    "ip": "120.4.@natural(0,255).@natural(0,255)",
                    "alarmContext": '@cparagraph(2,3)'
                }]
            }, {
                "name": "业务",
                "value|7-15": 12,
                "total|15-200": 24,
                "detailList|5-10": [{
                    "alarmTime": "2017年5月23日",
                    "ip": "120.4.@natural(0,255).@natural(0,255)",
                    "alarmContext": '@cparagraph(2,3)'
                }]
            }],
            "mergency|5-10": [
                "@csentence(10,15)"
            ]
        }
    })
})