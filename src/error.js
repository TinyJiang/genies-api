'use strict'
module.exports = {
    404: '找不到API文件',
    500: '系统内部错误',
    399: '系统无法处理当前API类型',
    0: 'Error编码有误',
    getErrorMsg: function(type, name) {
        var msg = this[type];
        if (msg) {
            if (name) {
                msg += name;
            }
            return msg;
        } else {
            return this.getErrorMsg(0)
        }
    }
}