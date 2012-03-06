(function(){
  var config, router, list, ErrorHandler, http, url, path, querystring, fs, vm, methods;
  config = require("../main.co").config;
  router = require("./router.co");
  list = require("../mvc/list.co");
  ErrorHandler = require("../mvc/error.co");
  http = require('http');
  url = require('url');
  path = require('path');
  querystring = require('querystring');
  fs = require('fs');
  vm = require('vm');
  methods = ['*', 'HEAD', 'GET', 'POST', 'PUT', 'TRACE', 'DELETE', 'OPTIONS', 'PATCH'];
  fs.readFile(path.join(config.appDir, "conf", "routes.conf"), function(data){
    var routes, server;
    routes = data.toString().split(/[\n\r]/).map(function(line){
      var parts;
      line = line.split("#").shift();
      if (line) {
        parts = line.split(/\s+/);
        if (parts.length > 2) {
          if (!__of(parts[0], methods)) {
            throw new SyntaxError("Invalid HTTP method " + parts[0]);
          }
          parts[2] = vm.createScript(parts[2], parts[1]);
          return parts;
        }
      }
    }).compact();
    return (server = http.createServer)(function(req, res){
      var timerId, body, off, match, port;
      timerId = process.pid + " " + req.connection.remoteAddress + " " + req.url;
      console.time(timerId);
      body = new Buffer(req.headers['content-length']) || 0;
      off = 0;
      match = [];
      if (req.method == "POST") {
        req.on("data", function(chunk){
          var off;
          off = body.write(chunk, off);
        });
      }
      try {
        match = routes.map(router.fill(req, res)).compact();
      } catch (e) {
        console.log(e.stack);
      }
      req.on("end", function(){
        var post, get, finish, err;
        post = {};
        get = url.parse(req.url, true).query;
        if (off) {
          post = querystring.parse(body.toString());
        }
        res.params = __import(get, post);
        if (match.length) {
          finish = res.end;
          res.end = function(){
            console.timeEnd(timerId);
            return finish.apply(res, arguments);
          };
          return match[0](__import(match[0].params, res.params));
        } else {
          err = new ErrorHandler({
            status: 404,
            path: req.url
          });
          return err.on('render', function(out){
            res.writeHead(404, req.url + " not found");
            return res.end(out);
          });
        }
      });
      port = config.port || 8000;
      return exports.go = function(){
        if ('address' in config) {
          return server.listen(port, config.address, console.log.fill("%d listening on %s:%d", process.pid, config.address, port));
        } else {
          return server.listen(port, console.log.fill("%d listening on *:%d", process.pid, config.address, port));
        }
      };
    });
  });
  function __of(x, arr){
    var i = 0, l = arr.length >>> 0;
    while (i < l) if (x === arr[i++]) return true;
    return false;
  }
  function __import(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
