define(function(require) {
    var api = require('../../scripts/api.config.js')
    if(!api.isOnline){
        require('./top5Data')
        require('./diskAlarmData')
        require('./diskStatusFailureData')
        require('./dateSearchData')
    }
})