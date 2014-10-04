require! \require-tree

export require-tree-configure = (each, path)-->
	require-tree path, {-index, each}

export load-tree = ->
	@require-tree-configure @~configure, it

export configure = (import app:this)
