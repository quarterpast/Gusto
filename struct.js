require("sugar.js");
Object.sugar();
const appDir = environment['user.dir'],
base = JSON.parse(readFile(appDir+"/conf/app.conf")),
config = exports.config = base.merge({appDir: appDir}),
server = require("server.js"),
actions = {
	"run": function(args) {
		server.init(config.merge({appMode:"testing"}))
	}.merge({desc:"Run the app in testing mode"}),
	"help": function(){
		print("Struct framework\n");
		for(let [k,v] in this) {
			print(k.pad(8," ",false),v.desc);
		}
	}.merge({desc:"Show this help"})
};
if(arguments[0] in actions)
	actions[Array.shift(arguments)](arguments);
else
	actions.help();
