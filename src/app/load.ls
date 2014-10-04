require! [\require-tree, path, fs, \deep-extend]

export resolve-path = (file)->
	path.resolve @base-path!, file

export merge-property = (prop, obj)->
		@{}[prop] `deep-extend` obj

export base-path = -> path.dirname require.main.filename

export require-tree-configure = (each, path)-->
	require-tree path, {-index, each}

export load-tree = ->
	@require-tree-configure @~configure, it

export configure = (import app:this)

export load = (thing)->
	@"#{thing}Preload"?!
	exists <- fs.exists @resolve-path @paths[thing]
	if exists
		@merge-property thing, @load-tree @resolve-path @paths[thing]
