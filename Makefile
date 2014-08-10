TEST_FILES = test/*.ls

include node_modules/make-livescript/livescript.mk

test: all $(TEST_FILES)
	node_modules/.bin/mocha -r LiveScript $(TEST_FILES)
