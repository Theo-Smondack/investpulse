#!/bin/bash
export DOLLAR="$"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/"$SERVER_NAME".key \
  -out /etc/ssl/private/"$SERVER_NAME".crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=$SERVER_NAME"

envsubst < /etc/nginx/snippets/http.conf.template > /etc/nginx/snippets/http.conf
envsubst < /etc/nginx/snippets/self-signed.conf.template > /etc/nginx/snippets/self-signed.conf

nginx -g "daemon off;"
