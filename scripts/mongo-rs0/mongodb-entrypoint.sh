#!/bin/sh
echo "🚀 Starting MongoDB replica set rs0"

mongod --port $MONGO_PORT_RS0 --replSet rs0 --bind_ip_all --keyFile /etc/mongodb/pki/keyfile --logpath /var/log/mongodb.log &
MONGOD_PID=$!

until mongosh --host $MONGO_HOST_RS0 --port $MONGO_PORT_RS0 --eval "db.adminCommand({ ping: 1 })" --quiet; do
    echo "⏳ Waiting for MongoDB to start..."
    sleep 2
done

echo "✅ mongo-rs0 is up."

until mongosh --host $MONGO_HOST_RS1 --port $MONGO_PORT_RS1 --eval "db.adminCommand({ ping: 1 })" --quiet; do
    echo "🕒 Waiting for mongo-rs1..."
    sleep 2
done

echo "✅ mongo-rs1 is up."

AUTH_CHECK=$(mongosh --host $MONGO_HOST_RS0 -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --port $MONGO_PORT_RS0 --authenticationDatabase admin --eval "db.runCommand({ connectionStatus: 1 }).authInfo.authenticatedUsers.length" --quiet || echo 0)

if [ $AUTH_CHECK -eq 0 ]; then
  MONGO_AUTH=""
else
  MONGO_AUTH="-u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin"
fi

REPLICA_EXIST=$(mongosh --quiet --port $MONGO_PORT_RS0 $MONGO_AUTH --eval "rs.status().ok" || echo 0)

if [ $REPLICA_EXIST -eq 0 ]; then
    echo "🔄 Initializing replica set rs0..."
    mongosh --port $MONGO_PORT_RS0 $MONGO_AUTH --eval "
        rs.initiate({
            _id: 'rs0',
            members: [
                { _id: 0, host: '$MONGO_HOST_RS0:$MONGO_PORT_RS0', priority: 2 },
                { _id: 1, host: '$MONGO_HOST_RS1:$MONGO_PORT_RS1', priority: 1 }
            ]
        });
    "
    echo "✅ Replica set rs0 initialized."
else
    echo "✅ Replica set rs0 already exists."
fi

echo "⏳ Waiting for PRIMARY node..."
until mongosh --host $MONGO_HOST_RS0 --port $MONGO_PORT_RS0 --eval "rs.isMaster().ismaster" | grep 'true'; do
    echo "🕒 PRIMARY not ready, waiting..."
    sleep 2
done

echo "✅ PRIMARY is ready."

if [ $AUTH_CHECK -eq 0 ]; then
  echo "🔑 Creating admin user..."
  mongosh --port $MONGO_PORT_RS0 --eval "
      db.getSiblingDB('admin').createUser({
          user: '$MONGO_INITDB_ROOT_USERNAME',
          pwd: '$MONGO_INITDB_ROOT_PASSWORD',
          roles: [{ role: 'root', db: 'admin' }]
      });
  "
  MONGO_AUTH="-u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --authenticationDatabase admin"
  echo "✅ Admin user created."
else
  echo "✅ Admin user already exists."
fi

INITDB_EXISTS=$(mongosh --quiet --port $MONGO_PORT_RS0 $MONGO_AUTH --eval "
    db = db.getSiblingDB('$MONGO_INITDB_DATABASE');
    db.getCollectionNames().length
" || echo 0)

if [ "$INITDB_EXISTS" -eq 0 ]; then
    echo "📦 Creating database and collection..."
    mongosh --port $MONGO_PORT_RS0 $MONGO_AUTH --eval "
        db = db.getSiblingDB('$MONGO_INITDB_DATABASE');
        db.createCollection('$MONGO_INITDB_COLLECTION');
    "
    echo "✅ Database and collection created."
else
    echo "✅ Database and collection already exist."
fi

wait $MONGOD_PID
