'use strict'
var fs = require('fs'),
    md = require('marked').parse;

var utils = require('./utils');

var dataPath = '../data/',
    currentApiTypes = ['json', 'md'],
    apiReader;


apiReader = {
    json: function(filepath, encoding) {
        var f = readFile(filepath, encoding);
        if (f) {
            return JSON.parse(f)
        }
    },
    md: function(filepath, encoding) {
        var f = readFile(filepath, encoding);
        if (f) {
            var html = md(f);
            return html
        }
    }
};

function readFile(filepath, encoding) {
    if (typeof(encoding) == 'undefined') {
        encoding = 'utf8'
    }
    filepath = dataPath + filepath;
    if (fs.existsSync(filepath)) {
        var file = fs.readFileSync(filepath, encoding);
        return file
    }
}

function readDir(filepath) {
    filepath = dataPath + filepath;
    var files;
    try {
        files = fs.readdirSync(filepath)
    } catch (e) {
        if (e.code != 'ENOTDIR') {
            console.error(e);
        }
        return e.code
    }
    return files
}

var getConf = function() {
    return apiReader['json']('config.json')
}

var getRealApiPath = function(path) {
    var f, p_tmp, type, rs;
    if (utils.isNotBlank(path)) {
        type = utils.getFileTypeByPath(path);
        if (utils.isNotBlank(type)) {
            f = readFile(path);
            if (f) {
                rs = path;
            }
        } else {
            for (var i = 0; i < currentApiTypes.length; i++) {
                p_tmp = path + '.' + currentApiTypes[i];
                f = readFile(p_tmp);
                if (f) {
                    rs = p_tmp;
                    break;
                }
            }
        }
    }
    return rs;
}

module.exports = {
    readContent: function(path) {
        var filetype = utils.getFileTypeByPath(path);
        if (utils.isNotBlank(filetype)) {
            return apiReader[filetype](path);
        }
    },
    readFile: readFile,
    getConf: getConf,
    readDir: readDir,
    getRealApiPath: getRealApiPath
}