FROM mongo:8

COPY ./scripts/mongo-rs0/mongodb-entrypoint.sh /usr/local/bin/mongodb-entrypoint.sh
RUN chmod +x /usr/local/bin/mongodb-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/mongodb-entrypoint.sh"]
