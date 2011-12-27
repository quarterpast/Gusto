const util = require("util"),
fs = require("fs"),
pathutil = require("path");

exports.file = function(path) {
	try {
		var read = fs.createReadStream(path);
		util.pump(read,this.result,function(error) {
			if(error) throw error;
		});

	} catch(e) {
		return {status:404};
	}
};
exports.file.id = "static.file";
exports.dir = function(dir,vars) {
	return exports.file(pathutil.join(dir,vars.file))
};

exports.dir.id = "static.dir";