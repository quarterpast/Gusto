require("extend.js").extend(Object,String,Array,Boolean,JSON);

var appDir = environment['user.dir'],
base = JSON.parse(readFile(appDir+"/conf/app.conf")),
config = Object.extend(base,{appDir: appDir}),
actions = {
	"run": function(args) {

	}._({desc:"Run the app in testing mode"}),
	"help": function(){
		print("Struct framework\n");
		for(let [k,v] in this) {
			print(k.pad(8," ",false),v.desc);
		}
	}._({desc:"Show this help"})
};
if(arguments[0] in actions)
	actions[Array.shift(arguments)](arguments);
else
	actions.help();
