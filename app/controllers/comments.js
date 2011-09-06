const mvc = require("mvc.js").init(module.id);
exports.comments = mvc.controller({
	"index": function(params) {
		this.render(params)
	}
});