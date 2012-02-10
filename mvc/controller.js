// controller.js
// turns an action hash into a proper controller
// THIS IS GOING TO CHANGE
const fs = require("fs"),
pathutil = require("path"),
template = require("./template.js");

module.exports = function(actions) {
	if(Object.isString(this)) {
		var base = pathutil.basename(this,".js");
	}
	var redirectors = {};
	actions.keys(function(k) {
		redirectors[k] = function(params) {
			var url = template.route(base+"."+k,"GET",params);
			this.redirect(url);
		};
	});
	actions.keys(function(action) {
		actions[action].context = redirectors;
		actions[action].id = base+"."+action;
	});
	return actions;
};