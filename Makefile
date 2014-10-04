TEST_FILES = $(shell find test -name '*.ls')
LS_OPTS = -bk

include node_modules/make-livescript/livescript.mk

test: all $(TEST_FILES)
	node_modules/.bin/mocha -r LiveScript -u exports $(TEST_FILES)

coverage: coverage.html
coverage.html: all $(TEST_FILES)
	node_modules/.bin/mocha -r blanket -r LiveScript -u exports $(TEST_FILES) -R html-cov > $@
