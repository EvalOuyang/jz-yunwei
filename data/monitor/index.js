define(function(require) {
    var api = require('../../scripts/api.config.js')
    if(!api.isOnline){
        require('./monitorData')
        require('./linesData')
    }
})