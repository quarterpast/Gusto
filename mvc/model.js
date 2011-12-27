const Schema = require("jugglingdb").Schema,
s = new Schema("redis",{"port":6379});

module.exports = s;
exports.Text = Schema.Text;