const config = require.main.exports.config,
util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime"),
crypto = require("crypto"),
cachezlib = require("cachezlib.js"),
list = require("mvc/list.js");

exports.file = function(request,result,path) {
	pathutil.exists(path,function(exists) {
		if(exists) {
			fs.stat(path,function(stat) {
				var read = fs.createReadStream(path),
				type = mime.lookup(path),
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
					read.pipe().pipe(result);
					result.end();
				} else {
					result.writeHead(200,baseHead);
					read.resume();
					read.pipe(result);
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