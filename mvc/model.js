const Schema = require("jugglingdb").Schema,
s = new Schema("redis",{"port":6379});

module.exports = function() {
	s.define.apply(s,arguments);
};
exports.Text = Schema.Text;