``#!/usr/bin/env node``

require! {
	subarg
	gusto: './index'
	path
}

argv = subarg do
	process.argv.slice 2
	alias:
		port: \p
		version: \v
		require: \r
	default:
		require: []

if argv.version
	return console.log (require '../package.json').version

for m in [] ++ argv.require
	require m

BaseApp = if argv.app or argv._.0
	require path.resolve that
else gusto.App

class CliApp extends BaseApp
	port: process.env.PORT ? 3000
	base-path: -> process.cwd!

app = new CliApp argv
app.run!
