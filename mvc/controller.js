const fs = require("fs"),
util = require("util"),
pathutil = require("path"),
Renderer = require("mvc/renderer.js"),
template = require("template.js"),
tmpl = require("tmpl");

module.exports = function(actions) {
	if(Object.isString(this)) {
		var base = pathutil.basename(this,".js");
	}
	var redirectors = {};
	actions.keys(function(k) {
		redirectors[k] = function(params) {
			var url = template.route(base+"."+k,"GET",params);

		}
	})

	return actions;
}