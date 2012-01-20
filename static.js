const config = require.main.exports.config,
util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime"),
crypto = require("crypto"),
zlib = require("zlib"),
list = require("mvc/list.js");

exports.file = function(request,result,path) {
	var read = fs.createReadStream(path),
	type = mime.lookup(path),
	ext = pathutil.extname(path).substr(1),
	filters = list.filters,
	hash = crypto.createHash("sha224");
	hash.update(request.headers.host);

	if(ext in filters) {
		var filter = filters[ext];
		filter.init(path);
	}
	read.resume();
	read.on("error", function(error) {
		result.emit("done",404,path+" not found.");
	}).on("data",function(chunk) {
		hash.update(chunk);
		if(filter) {
			filter.write(chunk,path);
		} else {
			result.emit("queue",["write",chunk]);
		}
	}).on("end",function() {
		var etag = hash.digest("hex");
		if(etag === request.headers["if-none-match"]) {
			result.emit("clearQueue");
			return result.emit("done",304,"Not modified",{
				"Content-type":type,
				"Cache-Control":"max-age=31556926",
				"ETag":etag,
				"Expires":Date.create("next year").format(Date.RFC1123)
			});
		}
		if(filter) {
			filter.output(path).on("error",function(e) {
				result.emit("done",500,"couldn't filter");
			}).on("done",function(out) {
				result.emit("queue",["write",out]);
				result.emit("done",200,{
					"Content-type":filter.type,
					"Cache-Control":"max-age=31556926",
					"ETag":etag,
					"Expires":Date.create("next year").format(Date.RFC1123)
				});
			});
		} else {
			result.emit("done",200,{
				"Content-type":type,
				"Cache-Control":"max-age=31556926",
				"ETag":etag,
				"Expires":Date.create("next year").format(Date.RFC1123)
			});
		}
	});
};
exports.file.id = "static.file";
exports.dir = function(request,result,dir,vars) {
	exports.file(request,result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";