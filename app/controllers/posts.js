const mvc = require(require.main.id);

exports.posts = mvc.controller({
	"index": function(params) {
		print("index")
		this.render({})
	}
});