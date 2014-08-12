``#!/usr/bin/env node``

require! {
	subarg
	gusto: './index'
	path
	deepmerge
}

argv = subarg do
	process.argv.slice 2
	alias:
		port: \p
		version: \v
		require: \r
		config: \c
	default:
		require: []
	boolean: [\version]

if argv.version
	return console.log (require '../package.json').version

for m in [] ++ argv.require
	require m

BaseApp = if argv.app or argv._.0
	require path.resolve that
else gusto.App

extra-config = if argv.config?
	require path.resolve that
else {}

class CliApp extends BaseApp
	port: process.env.PORT ? 3000
	base-path: -> process.cwd!

app = new CliApp (argv `deepmerge` extra-config)
app.run!
