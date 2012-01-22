const config = require.main.exports.config,
util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime"),
crypto = require("crypto"),
cachezlib = require("cachezlib.js"),
stream = require("stream"),
list = require("mvc/list.js");

exports.file = function(request,result,path) {
	pathutil.exists(path,function(exists) {
		if(exists) {
			fs.stat(path,function(err,stat) {
				if(err) {
					result.writeHead(500,"could not stat "+path);
					result.end();
				}
				var ext = pathutil.extname(path).substr(1),
				type = mime.lookup(path),filter;
				if(ext in list.filters) {
					filter = list.filters[ext];
					type = filter.type;
				}
				var read = fs.createReadStream(path),
				hash = crypto.createHash("sha224"),
				enc = request.headers["accept-encoding"].split(',')[0],
				cached = cachezlib(enc.capitalize())(
					path+stat.mtime.getTime(),
					stat.size
				),
				baseHead = {
					"content-type": type,
					"cache-control":"max-age=31556926",
					"expires":Date.create("next year").format(Date.RFC1123),
					"trailer":"Etag"
				};
				hash.update(request.headers.host);

				stream.Stream.prototype.filter = function(dest) {
					if(filter) {
						var that = this, f = list.filters[ext],
						b = new Buffer(stat.size), off = 0;
						this.on("data",function(chunk) {
							chunk.copy(b,off);
							off += chunk.length;
						}).on("end",function() {
							f(b,path).on("error",function(e) {
								result.writeHead(500,"could not filter "+path);
								result.end();
							}).on("data",function(out) {
								dest.write(out);
							});
						});
						return dest;
					}
					return this.pipe(dest);
				};

				read.on("data",function(chunk) {
					hash.update(chunk);
				}).on("end",function(){
					result.addTrailers({"Etag":hash.digest("hex")});
				});
				if(enc) {
					result.writeHead(200,baseHead.merge({
						"content-encoding": enc
					}));
					read.resume();
					read.filter(cached).pipe(result);
					result.end();
				} else {
					result.writeHead(200,baseHead);
					read.resume();
					read.filter(result);
					result.end();
				}
			});
		} else {
			result.writeHead(404,path+" not found");
			result.end();
		}
	});
};
exports.file.id = "static.file";

exports.dir = function(request,result,dir,vars) {
	exports.file(request,result,pathutil.join(dir,vars.file));
};
exports.dir.id = "static.dir";