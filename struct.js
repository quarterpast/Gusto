require("sugar.js");
Object.sugar();

var appDir = environment['user.dir'],
base = JSON.parse(readFile(appDir+"/conf/app.conf"));
config = base.merge({appDir: appDir});
var server = require("server.js"),
actions = {
	"run": function(args) {
		config.merge({appMode:"testing"});
		server.init();
	}.merge({desc:"Run the app in testing mode"}),
	"help": function(){
		print("Struct framework\n");
		for(let [k,v] in this) {
			print(k.padRight(" ",8-k.length),v.desc);
		}
	}.merge({desc:"Show this help"})
};
if(arguments[0] in actions)
	actions[Array.shift(arguments)](arguments);
else
	actions.help();
