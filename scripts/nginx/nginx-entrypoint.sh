#!/bin/bash
export DOLLAR="$"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/"$DNS".key \
  -out /etc/ssl/private/"$DNS".crt \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=$DNS" \
  -addext "subjectAltName = DNS:$DNS"

envsubst < /etc/nginx/snippets/http.conf.template > /etc/nginx/snippets/http.conf
envsubst < /etc/nginx/snippets/self-signed.conf.template > /etc/nginx/snippets/self-signed.conf

nginx -g "daemon off;"
