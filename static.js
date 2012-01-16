const util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime");

exports.file = function(result,path) {
	try {
		var read = fs.createReadStream(path);
		read.resume();
		util.pump(read,result,function(error) {
			if(error) throw error;
		});
		result.emit("done",200,{"Content-type":mime.lookup(path)});
	} catch(e) {
		result.emit("done",404,path+" not found.");
	}
};
exports.file.id = "static.file";
exports.dir = function(result,dir,vars) {
	exports.file(result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";