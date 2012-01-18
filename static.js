const config = require.main.exports.config,
util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime"),
fpath = pathutil.join(config.appDir,"conf","filters.js"),
filters = pathutil.existsSync(fpath) ? require(fpath) : {};

exports.file = function(result,path) {
	var read = fs.createReadStream(path),
	type = mime.lookup(path),
	filter = {content:function(c){return c;}};

	if(pathutil.extname(path) in filters) {
		filter = filters[pathutil.extname(path)];
		type = filter.mime;
	}
	read.resume();
	read.on("error", function(error) {
	}).on("data",function(chunk) {
		result.emit("queue",["write",filter.content(chunk)]);
	}).on("end",function() {
		result.emit("done",200,{"Content-type":type});
	});
};
exports.file.id = "static.file";
exports.dir = function(result,dir,vars) {
	exports.file(result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";