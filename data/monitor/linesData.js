define(function(require) {
    require('mock')
    var url = new RegExp('http://12.4.0.60:8080/jizhen-yunwei/yunwei/monitor/startTime/\\d{6}/endTime/\\d{6}')
    Mock.mock(url, {
        "code": 1,
        "msg": "success",
        "result": {
            "temperature|30-60": [{
                "time": "@date('yyyy-MM-dd')",
                "value|90-99.1": 52.5
            }],
            "humidity|30-60": [{
                "time": "@date('yyyy-MM-dd')",
                "value|90-99.1": 52.5
            }]
        }
    })
})