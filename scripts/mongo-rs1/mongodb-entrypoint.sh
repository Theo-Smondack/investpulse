#!/bin/sh

echo "🚀 Starting MongoDB replica set rs1"

until mongosh --host $MONGO_HOST_RS0 --port $MONGO_PORT_RS0 --eval "db.adminCommand({ ping: 1 })" --quiet; do
    echo "⏳ Waiting for PRIMARY node (rs0)..."
    sleep 2
done

echo "✅ mongo-rs0 is up."

mongod --port $MONGO_PORT_RS1 --replSet rs0 --bind_ip_all --keyFile /etc/mongodb/pki/keyfile --logpath /var/log/mongodb.log &
MONGOD_PID=$!

echo "✅ MongoDB replica set rs1 successfully started."
wait $MONGOD_PID
