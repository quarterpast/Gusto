const fs = require("fs"),
pathutil = require("path"),
template = require("template.js");

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
	actions.keys(function(action) {
		actions[action].id = base+"."+action;
		actions[action] = actions[action].bind(redirectors);
	})
	return actions;
}