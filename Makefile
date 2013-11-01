LIB=lib
SRC=src

LS_OPTS=-k

LS_FILES = $(shell find $(SRC)/ -type f -name '*.ls')
JS_FILES = $(patsubst $(SRC)/%.ls, $(LIB)/%.js, $(LS_FILES))

.PHONY: all
all: $(JS_FILES)

$(LIB)/%.js: $(SRC)/%.ls
	@mkdir -p "$(@D)"
	node_modules/.bin/lsc -pc $(LS_OPTS) "$<" > "$@"

clean:
	rm -rf lib

.PHONY: test
test: all
	node_modules/.bin/regis