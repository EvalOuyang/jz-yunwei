define(function(require) {
    require('mock')
    var url = new RegExp('http://12.4.0.60:8080/jizhen-yunwei/yunwei/mainInterface/startTime/\\d{8}/endTime/\\d{8}')
    Mock.mock(url, {
        "code": 1,
        "message": "success",
        "result": {
            "flow": {
                "list|40-43": [{
                    "name": '@cword(2, 4)',
                    "id|+1": 1,
                    "currFlow|1000-2200": 1758,
                    "delayTime|0-100": 868
                }]
            }
        }
    })
})