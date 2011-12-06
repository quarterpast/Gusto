require("sugar.js");
Object.sugar();
const fs = require("fs");

var appDir = process.cwd();
fs.readFile(appDir+"/conf/app.conf","utf8", function(err,data) {
	if(err) throw err;
	var base = JSON.parse(data);
	    config = base.merge({appDir: appDir});
	exports.config = config;
	var server = require("server.js"),
	actions = {
		"run": function() {
			config.merge({appMode:"testing"});
			server.init();
		}.merge({desc:"Run the app in testing mode"}),
		"help": function(){
			print("Struct framework\n");
			this.each(function(k,v){
				print(k.padRight(" ",8-k.length),v.desc);
			});
		}.merge({desc:"Show this help"})
	};
	if(arguments[0] in actions)
		actions[process.argv.shift()].apply(null,process.argv);
	else
		actions.help();
});