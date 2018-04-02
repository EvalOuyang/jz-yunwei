define(function(require) {
    require('mock')
    Mock.mock('ws://12.4.0.60:8080/jizhen-yunwei/yunwei/diskHost/top5', {
        "code": 1,
        "msg": "success",
        "result": {
            "networkTOP5|10": [{
                "list": [{
                        "name": "CPU",
                        "value": "100%"
                    },
                    {
                        "name": "吞吐量",
                        "value": "@float(2000,100000,1,3)Kbps"
                    },
                    {
                        "name": "内存",
                        "value": "@natural(0,100)%"
                    },
                    {
                        "name": "ip",
                        "value": "172.10.@natural(0,255).@natural(0,255)"
                    }, {
                        "name": "设备名称",
                        "value": "@cword(10)"
                    }
                ]
            }],
            "hostTOP5|10": [{
                "list": [{
                        "name": "CPU",
                        "value": "@natural(0,100)%"
                    },
                    {
                        "name": "交换率",
                        "value": "@natural(0,100)%"
                    },
                    {
                        "name": "内存",
                        "value": "@natural(0,100)%"
                    },
                    {
                        "name": "ip",
                        "value": "12.68.@natural(0,255).@natural(0,255)"
                    }, {
                        "name": "设备名称",
                        "value": "@cword(10)"
                    }
                ]
            }]
        }
    })
})