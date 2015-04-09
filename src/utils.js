'use strict'
var utils = {
    getFileType: function(fileName) {
        var type = '';
        if (this.isNotBlank(fileName) && fileName.indexOf('.') != -1) {
            type = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length)
        }
        return type;
    },
    getFileNameByPath: function(filePath) {
        var name = '';
        if (this.isNotBlank(filePath)) {
            name = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.length)
        }
        return name;
    },
    getFileTypeByPath: function(path) {
        var type, name = this.getFileNameByPath(path);
        if (this.isNotBlank(name)) {
            type = this.getFileType(name);
        }
        return type;
    },
    isNotBlank: function(str) {
        return this.isType(str, 'String') && str.length
    },
    isBlank: function(str) {
        return !this.isNotBlank(str)
    },
    isType: function(obj, type) {
        return Object.prototype.toString.call(obj) == '[object ' + type + ']';
    }
};
module.exports = utils;