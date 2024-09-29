#!/bin/bash
export DOLLAR="$"

envsubst < /etc/nginx/snippets/http.conf.template > /etc/nginx/snippets/http.conf
envsubst < /etc/nginx/snippets/ssl-certificate.conf.template > /etc/nginx/snippets/ssl-certificate.conf

exec "$@"

#nginx -g "daemon off;"
