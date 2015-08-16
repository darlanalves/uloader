test:
	./node_modules/karma/bin/karma start karma.conf.js --single-run

tdd:
	./node_modules/karma/bin/karma start karma.conf.js

build:
	cat src/uloader.js src/uloader.ajax.js > dist/uloader.js