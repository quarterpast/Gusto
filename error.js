const util = require("util"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js");

module.exports = function error(e) {
	var that = this;
	new Renderer("error",e).on("render",function(output) {
		that.emit("render",output);
	});
};
module.exports.prototype = new process.EventEmitter();