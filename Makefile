build:
	npm run build

upload-staging:
	rsync -r --delete \
		--exclude node_modules/ \
		--exclude .git/ \
		--exclude .cache/ \
		--exclude .idea/ \
		. halfof8:~/www/

start:
	npx pm2 start --name halfof8 npm -- start

restart:
	npx pm2 restart halfof8
