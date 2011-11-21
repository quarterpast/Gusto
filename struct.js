require("extend.js").extend(Object,String,Array,Boolean,JSON);

const appDir = environment['user.dir'],
      config = Object.extend(JSON.parse(readFile(appDir+"/conf/app.conf")),{appDir: appDir});
exports.config= config;
try {
	switch(arguments[0]) {
	case "run":
		appMode = "testing";
		require("server.js").init(appDir,appMode);
		break;
	default:
		print("Struct help coming soon");
	}
} catch(e) {
	for(let p in e) {
		let s = " ".times(20-p.length);
		print(p+":"+s+e[p]);
	}
}