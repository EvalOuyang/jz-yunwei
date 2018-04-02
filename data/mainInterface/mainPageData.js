define(function(require) {
    require('mock')
    Mock.mock('ws://12.4.0.60:8080/jizhen-yunwei/yunwei/mainInterface/flow', {
        "code": "1",
        "message": "success",
        "result": {
            "flow": {
                "list|42": [{
                    "name": '@cword(2, 4)',
                    "id|+1": 1,
                    "currFlow|1000-2200": 1758,
                    "delayTime|0-4000": 868
                }]
            },
            "link": {
                "total": {
                    "flow|1000-2200": 8888,
                    "bandWidth": '@natural(0,100)%'
                },
                "branch|12": [{
                    "name": '@cword(5,9)',
                    "status": '@natural(0,1)',
                    "flow|2000-5000": 0,
                    "bandWidth": '@natural(0,100)%'
                }]
            }
        }
    })
})