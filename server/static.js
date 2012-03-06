(function(){
  var util, pathutil, mime, crypto, Stream, http, fs, cachezlib, list, Renderer, ErrorHandler, reverse;
  util = require('util');
  pathutil = require('path');
  mime = require('mime');
  crypto = require('crypto');
  Stream = require('stream').Stream;
  http = require('http');
  fs = require('fs');
  cachezlib = require("./cachezlib.co");
  list = require("../mvc/list.co");
  Renderer = require("../mvc/renderer.co");
  ErrorHandler = require("../mvc/error.co");
  reverse = require("../mvc/template.co").route;
  exports.file = function(request, result, path){
    return pathutil.exists(path, function(exists){
      if (exists) {
        return fs.stat(path, function(err, stat){
          var ext, type, filter, read, hash, baseHead, enc, cached;
          if (err) {
            result.writeHead(501, "could not stat " + path);
            result.end();
          }
          ext = pathutil.extname(path).substr(1);
          type = mime.lookup(path);
          if (ext in list.filters) {
            type = (filter = list.filters[ext]).type;
          }
          read = fs.createReadStream(path);
          hash = crypto.createHash("sha224");
          baseHead = {
            'content-type': type,
            'cache-control': "max-age=31556926",
            'expires': Date.create("next year").format(Date.RFC1123),
            'trailer': "Etag"
          };
          hash.update(request.headers.host);
          if ("accept-encoding" in request.headers) {
            enc = (request.headers.accept - encoding.split(','))[0];
            cached = cachezlib(enc.capitalize()(path + stat.mtime.getTime(), stat.size));
          }
          Stream.prototype.filter = function(dest, opts){
            var b, off;
            if (filter != null) {
              b = new Buffer(stat.size);
              off = 0;
              this.on("data", function(chunk){
                chunk.copy(b, off);
                return off += chunk.length;
              });
              return this.on("end", function(){
                return filter(b, path).on("error", function(){
                  result.writeHead(501, "could not filter " + path);
                  return result.end();
                }).on("data", function(out){
                  return dest.end(out);
                });
              });
            } else {
              return this.pipe(dest, opts);
            }
          };
          read.on("data", function(chunk){
            return hash.update(chunk);
          });
          read.on("end", function(){
            return result.addTrailers({
              Etag: hash.digest("hex")
            });
          });
          if (enc) {
            result.writeHead(200, (baseHead['content-encoding'] = enc, baseHead));
            read.resume();
            return read.filter(cached).pipe(result);
          } else {
            result.writeHead(200, baseHead);
            read.resume();
            return read.filter(result);
          }
        });
      } else {
        result.writeHead(404, path + " not found");
        return result.end();
      }
    });
  };
  exports.file.id = 'static.file';
  exports.dir = function(request, result, dir, vars){
    return exports.file(request, result, pathutil.join(dir, vars.file));
  };
  exports.dir.id = 'static.dir';
  exports.template = function(request, result, dir, vars){
    var r;
    r = new Renderer(vars.file, {}, null, null, true);
    r.on("render", function(output){
      result.writeHead(200, {
        'Content-type': "text/x-template"
      });
      return result.end(output);
    });
    return r.on("error", function(e){
      var h;
      h = new ErrorHandler(e);
      return h.on("render", function(output){
        result.writeHead(501, {
          'Content-type': "text/html"
        });
        return result.end(output);
      });
    });
  };
  exports.template.id = 'static.template';
}).call(this);
