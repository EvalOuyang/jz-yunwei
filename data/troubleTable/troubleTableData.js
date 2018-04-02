define(function(require) {
    require('mock')
    var url = new RegExp('[ws|http]://12.4.0.60:8080/jizhen-yunwei/yunwei/troubleTable(/startTime/\\d{8}/endTime/\\d{8})?')
    Mock.mock(url, {
        "code": 1,
        "msg": "success",
        "result": {
            "faultProfile": [{
                    "name": "故障总数",
                    "value|7000-8000": 8000
                },
                {
                    "name": "已处理数",
                    "value|500-1000": 200
                },
                {
                    "name": "未处理数",
                    "value|100-200": 300
                },
                {
                    "name": "处理率",
                    "value": "@natural(0,100)%"
                }
            ],
            "faultType": {
                "FrontEnd": {
                    "total|200-300": 0,
                    "list|7": [{
                        "name": "@cword(4,7)",
                        "value|1000-2000": 200
                    }]
                },
                "system": {
                    "total|200-400": 0,
                    "list|12": [{
                        "name": "@cword(4,7)",
                        "value|1000-2000": 200
                    }]
                }
            },
            "newFault": {
                "title": "网络维护",
                "text": "三十二支队，在使用华为服务器时，链路断路，需要及时处理。"
            },
            "detachFault|10-20": [{
                "name": "@cword(6,11)",
                "value|5-10": 1,
                "already|200-500": 20,
                "unTreated|200-500": 30
            }]
        }
    })
})