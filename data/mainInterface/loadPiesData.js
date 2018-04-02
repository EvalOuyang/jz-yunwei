define(function(require) {
    require('mock')
    Mock.mock('ws://12.4.0.60:8080/jizhen-yunwei/yunwei/mainInterface/masterLoad', {
        "code": 1,
        "msg": "success",
        "result": {
            "cpu": [{
                    "name": "40%以下",
                    "list|500-800": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "CPU": '@natural(0,100)%'
                    }],
                    "value": '@integer(500,800)'
                },
                {
                    "name": "40-79%以下",
                    "list|200-300": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "CPU": '@natural(0,100)%'
                    }],
                    "value|200-300": 9
                },
                {
                    "name": "80-99%以下",
                    "list|10-100": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "CPU": '@natural(0,100)%'
                    }],
                    "value|10-100": 288
                },
                {
                    "name": "100%",
                    "list|0-10": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "CPU": '@natural(0,100)%'
                    }],
                    "value|0-10": 288
                }
            ],
            "cipan": [{
                    "name": "40%以下",
                    "list|500-800": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "cipan": '@natural(0,100)%'
                    }],
                    "value": '@integer(500,800)'
                },
                {
                    "name": "40-79%以下",
                    "list|200-300": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "cipan": '@natural(0,100)%'
                    }],
                    "value|200-300": 9
                },
                {
                    "name": "80-99%以下",
                    "list|10-100": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "cipan": '@natural(0,100)%'
                    }],
                    "value|10-100": 288
                },
                {
                    "name": "100%",
                    "list|0-10": [{
                        "name": "@cword(6,10)",
                        "ip": "192.168.@natural(0,255).@natural(0,255)",
                        "cipan": '@natural(0,100)%'
                    }],
                    "value|0-10": 288
                }
            ]
        }
    })
})