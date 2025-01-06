## Get Started

Create a `.env` file and add docker variables.

```bash
#### PROJECT ####
PROJECT_NAME=$YOUR_PROJECT_NAME$
PROJECT_DESCRIPTION=$YOUR_PROJECT_DESCRIPTION$
#################

#### DOCKER ####
NEXT_CONTAINER_NAME=$PROJECT_NAME$-nextjs
POSTGRES_CONTAINER_NAME=$PROJECT_NAME$-postgres
MINIO_CONTAINER_NAME=$PROJECT_NAME$-minio
NODE_PROJECT_PATH=$PATH_TO_CRYPTNEWS_NODE_PROJECT_PATH$
##################

#### POSTGRE ####
DATABASE_URL=$YOUR_DATABASE_URL$ # Contains the POSTGRES_CONTAINER_NAME
DATABASE_SEED_URL=$YOUR_DATABASE_SEED_URL$
POSTGRES_USER=$YOUR_POSTGRES_USER$
POSTGRES_PASSWORD=$YOUR_POSTGRES_PASSWORD$
POSTGRES_DB=$YOUR_POSTGRES_DB$
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

Run the following command to start the project.

```bash
make start
```

Setup the database.

```bash
make db-reset
```

Run migrations.

```bash
make db-migrate
```

## Initialize puppeteer

We use `@sparticuz/chromium` as the default browser for puppeteer ([See documentation](https://www.npmjs.com/package/@sparticuz/chromium)). To initialize puppeteer, first check the latest browser version available.

Example:  
If you use `@sparticuz/chromium@131` the version of `puppeteer-core` should be `23.8.0` relate to this [page](https://pptr.dev/supported-browsers).

Then, download the matching version of chromium [here](https://github.com/Sparticuz/chromium/releases) (Relate to the example it should be `chromium-v131.0.0-pack.tar
`) and put it in your MinIO bucket to simulate AWS S3 environment.


Enjoy! 🚀
