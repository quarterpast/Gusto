const util = require("util"),
fs = require("fs"),
pathutil = require("path"),
mime = require("mime");

exports.file = function(result,path) {
	//console.log(arguments);
	try {
		var read = fs.createReadStream(path);
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
	//console.log(arguments);
	exports.file(result,pathutil.join(dir,vars.file));
};

exports.dir.id = "static.dir";