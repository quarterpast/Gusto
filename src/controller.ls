BaseController = require \sodor .Controller

module.exports = class Controller extends BaseController
	@extended = (subclass)->
		@[]subclasses.push subclass

