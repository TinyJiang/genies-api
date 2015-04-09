'use strict'
var express = require('express');
var router = express.Router();

var reader = require('./reader'),
    _api = require('./api'),
    index = require('./index'),
    error = require('./error');


var conf = reader.getConf(),
    rootPath = {
        name: '首页',
        location: '/'
    };


router.get('/', function(req, res) {
    var apis = _api.getAllApi();
    res.render('index', {
        title: conf.name,
        api: apis,
        paths: [rootPath]
    });
});

router.get('^\/api([\/\w*]*)', function(req, res) {
    var path = req.params[0],
        _paths = path.split('\/'),
        pathTmp = '/api/',
        path_fix = 'api/';
    if (path.lastIndexOf('\/') == path.length - 1) {
        path = path.substring(0, path.length - 1)
    }

    var paths = [rootPath];
    for (var i = 0; i < _paths.length; i++) {
        if (!_paths[i] || !_paths[i].length)
            continue;
        pathTmp += (_paths[i] + '/');
        paths.push({
            name: _paths[i],
            location: pathTmp
        });
    }
    var api = _api.getApi({
        path: path_fix + path
    });
    if (api) {
        if (api.type == 'json') { //普通api
            res.render('detail', {
                title: conf.name,
                api: api.content,
                paths: paths
            });
        } else if (api.type == 'md') { //markdown
            res.render('markdown', {
                title: conf.name,
                content: api.content,
                paths: paths
            });
        } else {
            res.render('error/error', {
                title: conf.name,
                paths: paths,
                errormsg: error.getErrorMsg(399, api.type)
            });
        }
    } else {
        res.render('error/error', {
            title: conf.name,
            paths: paths,
            errormsg: error.getErrorMsg(404, path)
        });
    }
});

router.get('search_apis/:keywords', function(req, res) {
    //var rs = index.query(keywords);
});

router.post('search_apis', function(req, res) {
    var keywords = req.params.keywords;
    var rs = index.query(keywords);
    res.send(rs);
});

module.exports = router;