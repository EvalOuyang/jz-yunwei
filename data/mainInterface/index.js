define(function(require) {
    var api = require('../../scripts/api.config.js')
    if(!api.isOnline){
        require('./mainPageData')
        require('./loadPiesData')
        require('./alarmData')
        require('./dateSearchData')
    }
})