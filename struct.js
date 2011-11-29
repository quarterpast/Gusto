require("sugar.js");
Object.sugar();
const config = require("config.js"),
server = require("server.js"),
actions = {
	"run": function(args) {
		server.init(config.merge({appMode:"testing"}))
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
