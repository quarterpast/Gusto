require("sugar");
require("coffee-script");
Object.sugar();
const fs = require("fs"),
cluster = require("cluster"),
numCPUs = require('os').cpus().length,
appDir = process.cwd(),
base = JSON.parse(fs.readFileSync(appDir+"/conf/app.conf","utf8")),
config = exports.config = base.merge({appDir: appDir}),
actions = {
	"run": function(mode) {
		exports.mode = mode || "testing";
		if(cluster.isMaster) {
			for (var i = 0; i < numCPUs; i++) {
				cluster.fork();
			}
			cluster.on('death', function(hamster) {
				console.log('hamster ' + hamster.pid + ' died');
				cluster.fork();
			});
		} else {
			require("server.js").go();
		}
	}.merge({desc:"Run the app in testing mode"}),
	"help": function(){
		console.log("Struct framework\n");
		this.each(function(k,v){
			console.log(k.padRight(" ",8-k.length),v.desc);
		});
	}.merge({desc:"Show this help"}),
	"pack": function() {
		
	}.merge({desc:"Package the app in a single directory suitable for e.g. Nodester"})
};
if(process.argv[2] in actions)
	actions[process.argv[2]].apply(actions,process.argv.slice(3));
else
	actions.help();
