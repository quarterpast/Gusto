const mvc = require(require.main.id);

exports.posts = mvc.controller({
	"index": function(params) {
		print("index")
		this.renderJSON(params)
	},
	/*"new": function() {
		mvc.fromFiles("app/models").post.create({
			title: "test",
			date: Date.now(),
			content: "this is a test post"
		})
	}*/
});