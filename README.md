## Get Started

### Prerequisites
**⚠ Get node repository from [here](https://github.com/Theo-Smondack/cryptnews-node) and follow the instructions to setup the project.**

Create a `.env` file and add docker variables.

```dotenv
#### PROJECT ####
PROJECT_NAME=$YOUR_PROJECT_NAME$
PROJECT_DESCRIPTION=$YOUR_PROJECT_DESCRIPTION$
#################

#### DOCKER ####
NEXT_CONTAINER_NAME=$PROJECT_NAME$-nextjs
POSTGRES_CONTAINER_NAME=$PROJECT_NAME$-postgres
MINIO_CONTAINER_NAME=$PROJECT_NAME$-minio
NODE_CONTAINER_NAME=$PROJECT_NAME$-node
MONGO_CONTAINER_NAME=$PROJECT_NAME$-mongo
##################

#### NODE ####
NODE_PROJECT_PATH=$PATH_TO_CRYPTNEWS_NODE_PROJECT_PATH$ ## Where the node project that you retrieved from github is located
##############

#### MONGO ####
MONGO_INITDB_ROOT_USERNAME=$YOUR_MONGO_INITDB_ROOT_USERNAME$
MONGO_INITDB_ROOT_PASSWORD=$YOUR_MONGO_INITDB_ROOT_PASSWORD$
MONGO_INITDB_DATABASE=$YOUR_MONGO_INITDB_DATABASE$
MONGO_INITDB_COLLECTION=$YOUR_MONGO_INITDB_COLLECTION$
MONGO_HOST_RS0=$YOUR_MONGO_HOST_RS0$
MONGO_PORT_RS0=$YOUR_MONGO_PORT_RS0$
MONGO_HOST_RS1=$YOUR_MONGO_HOST_RS1$
MONGO_PORT_RS1=$YOUR_MONGO_PORT_RS1$
MONDODB_URL=$YOUR_MONGODB_URL$
##################

#### POSTGRE ####
POSTGRES_USER=$YOUR_POSTGRES_USER$
POSTGRES_PASSWORD=$YOUR_POSTGRES_PASSWORD$
POSTGRES_DB=$YOUR_POSTGRES_DB$
POSTGRES_URL=$YOUR_DATABASE_URL$ # Contains the POSTGRES_CONTAINER_NAME
##################

##### AUTH ######
NEXTAUTH_URL=$YOUR_NEXTAUTH_URL$
AUTH_SECRET=$YOUR_AUTH_SECRET$ # Generate a secret key using the command: openssl rand -base64 64
#################

##### MINIO #####
MINIO_ACCESS_KEY=$YOUR_MINIO_ACCESS_KEY$
MINIO_SECRET_KEY=$YOUR_MINIO_SECRET_KEY$
MINIO_ENDPOINT=$YOUR_MINIO_ENDPOINT$
MINIO_BUCKET=$YOUR_MINIO_BUCKET$
##################
```

First generate key file for MongoDB replica set.

```bash
make mongo-generate-keyfile
```

Then, run the following command to start the project.
```bash
make start
```

Setup the PostgreSQL database.

```bash
make db-reset
```

Run PostgreSQL migrations.

```bash
make db-migrate
```

Run the following command to seed the database.

```bash
make db-seed
```


## Configure Mongo Compass
After running the project, make sure to add the following line to your `/etc/hosts` file.

```plaintext
# Docker compose replicat set config
127.0.0.1 mongo-rs0
127.0.0.1 mongo-rs1
```

Then you can connect to the MongoDB replica set to Compass using the following connection string.

```plaintext
mongodb://$MONGO_INITDB_ROOT_USERNAME$:$MONGO_INITDB_ROOT_PASSWORD$@localhost:$MONGO_PORT_RS0$,localhost:$MONGO_PORT_RS1$/$MONGO_INITDB_DATABASE$?replicaSet=rs0
```


Enjoy! 🚀
