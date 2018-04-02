define(function(require) {
    require('mock')
    var url = new RegExp('http://12.4.0.60:8080/jizhen-yunwei/yunwei/diskHost/diskFailure/startTime/\\d{6}/endTime/\\d{6}')
    Mock.mock(url, {
        "code": 1,
        "msg": "success",
        "result": {
            "total|5-10": 5,
            "list": [{
                    "name": "曙光",
                    "value|200-300": 30,
                    "percent": "@natural(0,100)%",
                    "notRepair|0-100": 0,
                    "id": "1"
                },
                {
                    "name": "浪潮",
                    "value|200-300": 30,
                    "percent": "@natural(0,100)%",
                    "notRepair|0-100": 0,
                    "id": "2"
                },
                {
                    "name": "IBM",
                    "value|200-300": 30,
                    "percent": "@natural(0,100)%",
                    "notRepair|0-10": 0,
                    "id": "3"
                },
                {
                    "name": "华为",
                    "value": 0,
                    "percent": "",
                    "notRepair|0-100": 0,
                    "willAlarm":12,
                    "id": "4"
                }
            ]
        }
    })
});