importPackage(Packages.com.sun.net.httpserver);
importPackage(java.io);
require("extend.js").extend(Object,String,Array);
const appDir = environment['user.dir'],
      config = Object.extend(JSON.parse(readFile(appDir+"/conf/app.conf")),{appDir: appDir});

switch(arguments[0]) {
case "run":
	appMode = "testing";
	require("server.js").init(appDir,appMode);
	break;
default:
	print("Struct help coming soon");
}