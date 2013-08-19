export class action
	(spec,func)->
		[@func,@spec] = if func? then [func,spec] else [spec,{}]

export class controller
	@subclasses = {}
	@extended = (subclass)->
		process.next-tick ~> # make sure .display-name is there when it's defined post facto
			@subclasses[subclass.display-name] = subclass

	@actions = ->filter (instanceof action), @prototype

	(...args)~>
		| args.0 instanceof livewire.Request => # called from router
			[@request] = args
		| otherwise => # i'm javascript, i don't have classes
			[name,spec] = args
			return class extends controller implements spec => @display-name = name
