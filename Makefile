build:
	npm run build

upload-staging:
	rsync -r --delete \
		--exclude node_modules/ \
		--exclude .git/ \
		--exclude .cache/ \
		--exclude .idea/ \
		. halfof8:~/www/

run: build
	npm start
