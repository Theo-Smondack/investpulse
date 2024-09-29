# Get Started

## Setting up
Create a `.env` file and add the following variables.

```
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

Once your `.env`file is created add new host to your local machine host file (For example in MacOS the host file is located at `/etc/hosts`). In this file add the following line :
```
127.0.0.1 YOUR_DNS # Related to the DNS of your .env file
```


Then you must generate SSL certificate for local NGINX development environment using:
```bash
make generate-dev-ssl-certificate
```

## Start project
Run the following commands to start the project in development environnement.

```bash
make start
```

Setup the database.

```bash
make db-reset
```

Reset database migrations.

```bash
make db-migrate-reset
```

Go to https://localhost, Enjoy! 🚀
