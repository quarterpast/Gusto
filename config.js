const appDir = environment['user.dir'],
base = JSON.parse(readFile(appDir+"/conf/app.conf"));

exports.config = base.merge({appDir: appDir});