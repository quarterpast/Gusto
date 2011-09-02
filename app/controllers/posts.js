const mvc = require(require.main.id);

exports.posts = mvc.controller({
	"index": function(params) {
		this.render({})
	}
});