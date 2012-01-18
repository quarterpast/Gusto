const util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime");

exports.file = function(result,path) {
	var read = fs.createReadStream(path);
	read.resume();
	read.on("error", function(error) {
	}).on("data",function(chunk) {
		result.emit("queue",["write",chunk]);
	}).on("end",function() {
		result.emit("done",200,{"Content-type":mime.lookup(path)});
	});
};
exports.file.id = "static.file";
exports.dir = function(result,dir,vars) {
	exports.file(result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";