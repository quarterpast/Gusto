require("extend.js").extend(Object,String,Array,Boolean,JSON);

const actions = {
	
},
      appMode = arguments[0] in actions ? actions[arguments[0]]() : actions.help(),
      appDir = environment['user.dir'],
      base = JSON.parse(readFile(appDir+"/conf/app.conf")),
      config = Object.extend(base,{appDir: appDir, appMode:appMode});