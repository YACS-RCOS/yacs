Hello Sysadmin,

When you run the command 'docker-compose build', the contents of this directory will be copied to the main docker container and the nginx docker container.

The default nginx.config file requires that the following files exist:
- yacs.cer
- yacs.key
- dhparam.pem

A 4096-bit Diffie-Hellman parameters file should be generated using the command 'openssl dhparam -out /etc/nginx/ssl/dhparam.pem 4096' (from the YACS working directory) for enhanced server security using a safe prime.

If you do not have a ssl certificate on hand, you can generate one for free using the Let's Encrypt cert bot. Then, simply move the generated files to this directory and modify the nginx config accordingly.

At the end of this, you'll have a highly secure YACS on docker.
