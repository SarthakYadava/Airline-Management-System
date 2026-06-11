#!/bin/sh
set -eu

mysql --protocol=socket -uroot -p"${MYSQL_ROOT_PASSWORD}" <<SQL
CREATE DATABASE IF NOT EXISTS skyroute_flights;
CREATE DATABASE IF NOT EXISTS skyroute_auth;
CREATE DATABASE IF NOT EXISTS skyroute_bookings;
CREATE DATABASE IF NOT EXISTS skyroute_notifications;
GRANT ALL PRIVILEGES ON skyroute_flights.* TO '${MYSQL_USER}'@'%';
GRANT ALL PRIVILEGES ON skyroute_auth.* TO '${MYSQL_USER}'@'%';
GRANT ALL PRIVILEGES ON skyroute_bookings.* TO '${MYSQL_USER}'@'%';
GRANT ALL PRIVILEGES ON skyroute_notifications.* TO '${MYSQL_USER}'@'%';
FLUSH PRIVILEGES;
SQL

