const config = require.main.exports.config,
util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime"),
list = require("mvc/list.js");

exports.file = function(result,path) {
	var read = fs.createReadStream(path),
	type = mime.lookup(path),
	ext = pathutil.extname(path).substr(1),
	filters = list.filters;

	if(ext in filters) {
		var filter = filters[ext];
		filter.init(path);
	}
	read.resume();
	read.on("error", function(error) {
		result.emit("done",404,path+" not found.");
	}).on("data",function(chunk) {
		if(filter) {
			filter.chunk(chunk,path);
		} else {
			result.emit("queue",["write",chunk]);
		}
	}).on("end",function() {
		if(filter) {
			filter.output(path).on("error",function(e) {
				result.emit("done",500,"couldn't filter");
			}).on("done",function(out) {
				result.emit("queue",["write",chunk]);
				result.emit("done",200,{"Content-type":filter.type});
			});
		} else {
			result.emit("done",200,{"Content-type":type});
		}
	});
};
exports.file.id = "static.file";
exports.dir = function(result,dir,vars) {
	exports.file(result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";