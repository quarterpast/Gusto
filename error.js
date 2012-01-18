const util = require("util"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js");

module.exports = function ErrorHandler(e) {
	var that = this;
	console.dir(e.type);
	new Renderer(
		"status" in e ? status : "error",
	e).on("render",function(output) {
		that.emit("render",output);
	}).on("error",function(e) {
		console.error("WE'RE DOOMED!");
		throw e;
	});
};
module.exports.prototype = new process.EventEmitter();