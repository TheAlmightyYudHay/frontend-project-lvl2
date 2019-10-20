install:
	npm install

publish:
	npm publish --dry-run

lint:
	npx eslint .

make start:
	npx babel-node src/bin/gendiff.js