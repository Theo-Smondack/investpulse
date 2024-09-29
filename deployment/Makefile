include ../.env

.DEFAULT_GOAL:=help
PWD=$(shell pwd)
ROOT_DIR=..
TAG_VERSION ?= latest
COMPOSE=TAG_VERSION=$(TAG_VERSION) docker compose -f $(ROOT_DIR)/docker-compose.yml -f $(ROOT_DIR)/docker/docker-compose.prod.yml
EXECNEXT=$(COMPOSE) exec next
EXECPG=$(COMPOSE) exec postgres
EXECNGINX=$(COMPOSE) exec nginx
EXECPRISMA=$(EXECNEXT) npx prisma

## Test comment

## All commands available in the Makefile

##@ Helper
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nAll commands available in the Makefile\n \nUsage:\n  make \033[36m<target>\033[0m\n"} /^[.a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Starting/stopping the project
up: ## Start the project
	$(COMPOSE) up -d --remove-orphans

up-recreate-app: ## Start the project and recreate the containers - Deploy specific version (Usage: make up-recreate-app TAG_VERSION=v1.2.3)
	echo "Deploying version $(TAG_VERSION)"; \
	$(COMPOSE) up -d --remove-orphans --force-recreate next nginx

stop: ## Stop containers project
	$(COMPOSE) stop

down: ## Stop and remove containers project
	$(COMPOSE) down

restart: ## Restart containers project
	$(COMPOSE) restart

##@ NextJs Container
compose-stop-next: ## Stop the next container
	$(COMPOSE) stop next

compose-restart-next: ## Restart the next container
	$(COMPOSE) restart next

compose-up-recreate-next: ## Start the next container and recreate the container
	$(COMPOSE) up -d --remove-orphans --force-recreate next

compose-down-next: ## Stop and remove the next container
	$(COMPOSE) down next

##@ Installation
yarn: ## Install the Next.js App dependencies into the next container
	$(EXECNEXT) yarn install

##@ Linting
lint: ## Lint the Next.js App
	$(EXECNEXT) yarn lint

format: ## Format the Next.js App
	$(EXECNEXT) yarn format

# Update
update: ## Update the Next.js App dependencies
	$(EXECNEXT) npx npm-check-updates -i

##@ Build & Preview
build-start: next-build next-start ## Build and start the Next.js App

next-build: ## Build the Next.js App
	$(EXECNEXT) yarn build

next-start: ## Start the Next.js App (build)
	$(EXECNEXT) yarn start

##@ Postgres Container
compose-start-pg: ## Start the postgres container
	$(COMPOSE) up -d --remove-orphans --force-recreate postgres

compose-stop-pg: ## Stop the postgres container
	$(COMPOSE) stop postgres

compose-restart-pg: ## Restart the postgres container
	$(COMPOSE) restart postgres

##@ Nginx Container

compose-stop-nginx: ## Stop the nginx container
	TAG_VERSION=$(TAG_VERSION) $(COMPOSE) stop nginx

compose-restart-nginx: ## Restart the nginx container
	TAG_VERSION=$(TAG_VERSION) $(COMPOSE) restart nginx

compose-up-recreate-nginx: ## Start the nginx container and recreate the container
	TAG_VERSION=$(TAG_VERSION) $(COMPOSE) up -d --remove-orphans --force-recreate nginx

##@ SSH
ssh-next: ## SSH into the next container in development
	$(EXECNEXT) bash

ssh-pg: ## SSH into the postgres container - development
	$(EXECPG) bash

ssh-nginx: ## SSH into the nginx container
	$(EXECNGINX) bash

##@ Database

##@ PostgreSQL
db-drop: ## Drop the database
	$(EXECPG) dropdb -U ${POSTGRES_USER} ${POSTGRES_DB}

db-create: ## Create the database
	$(EXECPG) createdb -U ${POSTGRES_USER} ${POSTGRES_DB}

db-remove-sessions: ## Remove all sessions from the database
	$(EXECPG) psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = 'investpulse-db' AND pid <> pg_backend_pid();"


##@ Prisma
prisma-generate: ## Generate the Prisma Client
	$(EXECPRISMA) generate

db-reset: db-drop db-create db-push db-pull ## Reset the database

db-push: ## Create the database
	$(EXECPRISMA) db push

db-pull: ## Pull the database
	$(EXECPRISMA) db pull

db-migrate-dev: ## Migrate the database
	$(EXECPRISMA) migrate dev;

db-migrate-reset: ## Reset the database migrations
	$(EXECPRISMA) migrate reset

db-rollback-migration: ## Rollback a database migration
	@echo "Please enter the migration name to rollback:"; \
	read name; \
	search_name=$$(echo "$$name" | sed 's/[ -]/_/g'); \
	matching_folder=$$(find $(ROOT_DIR)/prisma/migrations -type d -name "*$$search_name*"); \
	if [ -n "$$matching_folder" ]; then \
		  migration_name=$$(basename "$$matching_folder"); \
    	  echo "Found migration folder: $$matching_folder"; \
    	  $(EXECPRISMA) db execute --file "$$matching_folder/down.sql" --schema $(ROOT_DIR)/prisma/schema.prisma; \
    	  $(EXECPRISMA) migrate resolve --rolled-back "$$migration_name"; \
    	else \
    	  echo "No matching migration folder found for: $$name"; \
    	  exit 1; \
    	fi

db-seed: ## Seed the database
	$(EXECPRISMA) db seed

##@ Containers
list-containers: ## List all containers
	$(COMPOSE) ps -a

##@ Logs
logs: ## Show logs
	$(COMPOSE) logs

logs-next: ## Show logs for the next container
	$(COMPOSE) logs --since 1m -f next

logs-pg: ## Show logs for the postgres container
	$(COMPOSE) logs postgres

logs-nginx: ## Show logs for the nginx container
	$(COMPOSE) logs nginx --since 1m -f
