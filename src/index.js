'use strict'
//全局api索引
var _api = require('./api');

var api_store = {};

var init = function() {
    var apis = _api.getAllApi();
    addIndex(apis);
}

var addIndex = function(apis) {
    for (var i = 0; i < apis.length; i++) {
        if (apis[i].hasChildren()) { //文件夹不加入索引
            addIndex(apis[i].children);
        } else {
            api_store[apis[i].path] = apis[i];
        }
    }
}

var query = function(key) {
    var rs = [];
    for (var i in api_store) {
        if (i.toLowerCase().indexOf(key.toLowerCase()) != -1) {
            rs.push(api_store[i]);
        }
    }
    return rs
}


module.exports = {
    init: init,
    query: query
}