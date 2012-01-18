const config = require.main.exports.config,
util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime"),
fpath = pathutil.join(config.appDir,"conf","filters.js"),
filters = pathutil.existsSync(fpath) ? require(fpath) : {};

exports.file = function(result,path) {
	var read = fs.createReadStream(path),
	type = mime.lookup(path);

	if(pathutil.extname(path) in filters) {
		var filter = filters[pathutil.extname(path)];
		type = filter.mime;
	}
	read.resume();
	read.on("error", function(error) {
		result.emit("done",404,path+" not found.");
	}).on("data",function(chunk) {
		if(filter) {
			filter.content(chunk).on("error",function(e) {
				result.emit("done",500,"could not filter");
			}).on("done",function(out) {
				result.emit("queue",["write",out]);
			});
		} else {
			result.emit("queue",["write",chunk]);
		}
	}).on("end",function() {
		result.emit("done",200,{"Content-type":type});
	});
};
exports.file.id = "static.file";
exports.dir = function(result,dir,vars) {
	exports.file(result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";