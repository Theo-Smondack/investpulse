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
NGINX_CONTAINER_NAME=$PROJECT_NAME$-nginx
##################

#### NGINX ####
DNS=$DNS$
##############

#### POSTGRE ####
POSTGRES_URL=$YOUR_POSTGRES_URL$ # Contains the POSTGRES_CONTAINER_NAME
POSTGRES_USER=$YOUR_POSTGRES_USER$
POSTGRES_PASSWORD=$YOUR_POSTGRES_PASSWORD$
POSTGRES_DB=$YOUR_POSTGRES_DB$
##################

##### AUTH ######
NEXTAUTH_URL=$YOUR_NEXTAUTH_URL$
AUTH_SECRET=$YOUR_AUTH_SECRET$ # Generate a secret key using the command: openssl rand -base64 64
#################
```

Run the following commands to start the project in development environnement.

```bash
make start
```

Setup the database.

```bash
make db-reset
```

Run migrations.

```bash
make db-migrate-dev
```

Enjoy! 🚀
