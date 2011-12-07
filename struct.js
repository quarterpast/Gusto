require("sugar.js");
Object.sugar();
const fs = require("fs"),
      appDir = process.cwd(),
      base = JSON.parse(fs.readFileSync(appDir+"/conf/app.conf","utf8")),
      config = exports.config = base.merge({appDir: appDir}),
      server = require("server.js"),
      actions = {
      	"run": function() {
      		config.merge({appMode:"testing"});
      		server();
      	}.merge({desc:"Run the app in testing mode"}),
      	"help": function(){
      		print("Struct framework\n");
      		this.each(function(k,v){
      			print(k.padRight(" ",8-k.length),v.desc);
      		});
      	}.merge({desc:"Show this help"})
      };
if(process.argv[0] in actions)
	actions[process.argv.shift()].apply(actions,process.argv);
else
	actions.help();
