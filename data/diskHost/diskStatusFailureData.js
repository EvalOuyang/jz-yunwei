define(function(require) {
    require('mock')
    Mock.mock('ws://12.4.0.60:8080/jizhen-yunwei/yunwei/diskHost/diskStatusFailure', {
        "code": 1,
        "msg": "success",
        "result": {
            "diskStatus": {
                "total": 1000,
                "status": [{
                        "name": "即将损坏",
                        "value": 80,
                        "percent": "2.3%"
                    },{
                        "name": "故障",
                        "value": 80,
                        "percent": "5.1%"
                    },
                    {
                        "name": "正常",
                        "value": 8000,
                        "percent": "80%"
                    }
                ]
            },
            "diskFailure": {
                "total": 5,
                "list": [{
                        "name": "曙光",
                        "value": 30,
                        "percent": "30%",
                        "notRepair": 18,
                        "willAlarm":12,
                        "id": "1"
                    },
                    {
                        "name": "浪潮",
                        "value": 0,
                        "percent": "",
                        "notRepair": 56,
                        "willAlarm":12,
                        "id": "2"
                    },
                    {
                        "name": "IBM",
                        "value": 300,
                        "percent": "30%",
                        "notRepair": 76,
                        "willAlarm":12,
                        "id": "3"
                    },
                    {
                        "name": "华为",
                        "value": 0,
                        "percent": "",
                        "notRepair": 33,
                        "willAlarm":12,
                        "id": "4"
                    }
                ]
            }
        }

    })
})