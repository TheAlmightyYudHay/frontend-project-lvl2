install:
	npm install

publish:
	npm publish --dry-run

lint:
	npx eslint .

start:
	npx babel-node src/bin/gendiff.js

test-coverage:
	npm test -- --coverage

test:
	npm test