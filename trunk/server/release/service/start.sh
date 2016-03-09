#!/bin/bash
export LC_ALL="en_US.utf8"

mkdir /data/
mkdir /data/excel/
mkdir /data/excel/tpl
mkdir /data/excel/upload
mkdir /data/html/
mkdir /data/html/cgi-bin/
mkdir /data/log/
mkdir /data/log/nginx/
mkdir /data/log/php/
mkdir /data/log/php-fpm/
mkdir /data/log/service/
mkdir /data/service/
mkdir /data/upload/

chown www:www -R /data/

/etc/init.d/php-fpm start
/etc/init.d/nginx start

crond start

/data/service/UidSetter

tail -f
