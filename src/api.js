'use strict'
var utils = require('./utils');
var reader = require('./reader');

var setChildren = function(api, path) {
    var files = reader.readDir(path),
        children = [],
        a,
        f;
    if (utils.isType(files, 'Array')) {
        for (var i = 0; i < files.length; i++) {
            f = files[i];
            if (f && f.charAt(0) != '.') {
                var c_path = path + '/' + f;
                a = new Api({
                    path: c_path
                })
                setChildren(a, c_path);
                children.push(a);
            }
        }
        api.children = children;
    }
    return api
};

var Api = function(conf) {
    var me = this;
    me.path = conf.path;
    me.url = conf.url;

    //计算proterties
    var showPath = '',
        name = '',
        type = '',
        fileName = '';
    if (me.path && me.path.length) {
        name = utils.getFileNameByPath(me.path);
        type = utils.getFileType(name);
        showPath = me.path.substring(0, me.path.length - type.length - 1);
        if (type.length) {
            fileName = name.substring(0, name.length - type.length - 1);
        } else {
            fileName = name;
        }
    }
    me.showPath = showPath;
    me.name = name;
    me.type = type;
    me.fileName = fileName;

    //读取子节点信息
    if (utils.isNotBlank(me.url)) { //直接跳转的api
    } else if (me.path && me.path.length) { //本地配置的api
        setChildren(me, me.path);
    }

    //设置content
    me.content = reader.readContent(me.path);
};
Api.prototype.hasChildren = function() {
    return this.children && this.children.length
}
Api.prototype.getPath = function() {
    return this.url || this.path
}
Api.prototype.getShowPath = function() {
    return this.url || this.showPath
}
Api.prototype.getContent = function() {
    return this.content
}


module.exports = {
    getApi: function(conf) { //根据path获取api对象，不存在则返回null
        var realpath;
        if (conf && conf.path) {
            realpath = reader.getRealApiPath(conf.path);
            if (realpath) {
                conf.path = realpath;
                return new Api(conf)
            }
        }
    },
    getAllApi: function() {
        var conf = reader.getConf(),
            api = [],
            tmp;
        for (var i = 0; i < conf.api.length; i++) {
            tmp = new Api(conf.api[i]);
            api.push(tmp);
        }
        return api
    }
};