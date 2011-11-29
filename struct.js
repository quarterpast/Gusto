require("extend.js").extend(Object,String,Array,Boolean,JSON);
load("sugar.js");
Object.sugar();
const staticroute = require("staticroute.js"),
server = require("server.js").init(router,staticroute);
var appDir = environment['user.dir'],
base = JSON.parse(readFile(appDir+"/conf/app.conf")),
config = Object.extend(base,{appDir: appDir}),
actions = {
	"run": function(args) {

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
