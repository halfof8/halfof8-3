build:
	npm run build

staging-upload:
	rsync -r --delete \
		--exclude node_modules/ \
		--exclude .git/ \
		--exclude .cache/ \
		--exclude .idea/ \
		. halfof8:~/www/

staging-start:
	pm2 start --name halfof8 npm -- start

staging-stop:
	pm2 kill --name halfof8
	pm2 delete --name halfof8

staging-restart:
	pm2 restart halfof8
