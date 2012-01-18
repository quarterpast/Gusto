const config = require.main.exports.config,
util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime"),
crypto = require("crypto"),
list = require("mvc/list.js");

exports.file = function(result,path) {
	var read = fs.createReadStream(path),
	type = mime.lookup(path),
	ext = pathutil.extname(path).substr(1),
	filters = list.filters,
	hash = crypto.createHash("md5");

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
			filter.chunk(chunk,path);
		} else {
			result.emit("queue",["write",chunk]);
		}
	}).on("end",function() {
		var etag = hash.digest("hex");
		if(filter) {
			filter.output(path).on("error",function(e) {
				result.emit("done",500,"couldn't filter");
			}).on("done",function(out) {
				result.emit("queue",["write",out]);
				result.emit("done",200,{
					"Content-type":filter.type,
					"ETag":etag
				});
			});
		} else {
			result.emit("done",200,{
				"Content-type":type,
				"ETag":etag
			});
		}
	});
};
exports.file.id = "static.file";
exports.dir = function(result,dir,vars) {
	exports.file(result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";