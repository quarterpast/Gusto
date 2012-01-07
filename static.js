const util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime");

exports.file = function(path) {
	try {
		var read = fs.createReadStream(path);
		util.pump(read,this.result,function(error) {
			if(error) throw error;
		});

	} catch(e) {
		return {status:404};
	}
	return {type:mime.lookup("path")};
};
exports.file.id = "static.file";
exports.dir = function(dir,vars) {
	console.log(arguments)
	return exports.file(pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";