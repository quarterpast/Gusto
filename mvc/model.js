const Schema = require("jugglingdb").Schema,
s = new Schema("redis",{"port":6379});
// THIS IS GOING TO CHANGE
module.exports = s;
exports.Text = Schema.Text;