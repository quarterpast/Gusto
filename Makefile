all: clean
	coco -o lib -c src
watch: clean
	coco -o lib -wc src
clean:
	rm -rf lib
