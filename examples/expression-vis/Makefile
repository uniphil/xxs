output = app.browser.js

js: $(filter-out $(output), $(wildcard *)) ../../*.js
	../../node_modules/.bin/browserify app.js --debug -t [ babelify --presets [ es2015 ] ] -o $(output)

watch: it
	../../node_modules/.bin/nodemon -i $(output) --exec "make js || true"

.PHONY: js it
