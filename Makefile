include .env

.DEFAULT_GOAL:=help
PWD=$(shell pwd)
COMPOSE=docker compose -f docker-compose.yml -f docker/docker-compose.dev.yml
EXECNEXT=$(COMPOSE) exec next
EXECPG=$(COMPOSE) exec postgres
EXECNGINX=$(COMPOSE) exec nginx
EXECPRISMA=$(EXECNEXT) yarn prisma

## All commands available in the Makefile

##@ Helper
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nAll commands available in the Makefile\n \nUsage:\n  make \033[36m<target>\033[0m\n"} /^[.a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Starting/stopping the project
start: build up-recreate ## Build and start containers project

build: ## Build containers project
	$(COMPOSE) build --force-rm

up: ## Start the project
	$(COMPOSE) up -d --remove-orphans

up-recreate: ## Start the project and recreate the containers
	$(COMPOSE) up -d --remove-orphans --force-recreate

stop: ## Stop containers project
	$(COMPOSE) stop

down: ## Stop and remove containers project
	$(COMPOSE) down

restart: ## Restart containers project
	$(COMPOSE) restart

##@ NextJs Container
compose-start-next: compose-build-next compose-up-recreate-next ## Build ans start the next container

compose-stop-next: ## Stop the next container
	$(COMPOSE) stop next

compose-restart-next: ## Restart the next container
	$(COMPOSE) restart next

compose-build-next: ## Build the next container
	$(COMPOSE) build next --force-rm

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

##@ Nginx Container
compose-start-nginx: compose-build-nginx compose-up-recreate-nginx ## Build ans start the nginx container

compose-stop-nginx: ## Stop the nginx container
	$(COMPOSE) stop nginx

compose-restart-nginx: ## Restart the nginx container
	$(COMPOSE) restart nginx

compose-build-nginx: ## Build the nginx container
	$(COMPOSE) build nginx --force-rm

compose-up-recreate-nginx: ## Start the nginx container and recreate the container
	$(COMPOSE) up -d --remove-orphans --force-recreate nginx

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
	$(EXECPG) dropdb ${POSTGRES_DB}

db-create: ## Create the database
	$(EXECPG) createdb ${POSTGRES_DB}

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

db-create-migration: ## Create database migration
	@echo "Please enter the migration name:"; \
	read name; \
	$(EXECPRISMA) migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script > down.sql; \
	$(EXECPRISMA) migrate dev --create-only --name $$name;\
	search_name=$$(echo "$$name" | sed 's/[ -]/_/g'); \
	matching_folder=$$(find prisma/migrations -type d -name "*$$search_name*"); \
	mv down.sql $$matching_folder; \

db-rollback-migration: ## Rollback a database migration
	@echo "Please enter the migration name to rollback:"; \
	read name; \
	search_name=$$(echo "$$name" | sed 's/[ -]/_/g'); \
	matching_folder=$$(find prisma/migrations -type d -name "*$$search_name*"); \
	if [ -n "$$matching_folder" ]; then \
		  migration_name=$$(basename "$$matching_folder"); \
    	  echo "Found migration folder: $$matching_folder"; \
    	  $(EXECPRISMA) db execute --file "$$matching_folder/down.sql" --schema prisma/schema.prisma; \
    	  $(EXECPRISMA) migrate resolve --rolled-back "$$migration_name"; \
    	else \
    	  echo "No matching migration folder found for: $$name"; \
    	  exit 1; \
    	fi

db-seed: ## Seed the database
	$(EXECPRISMA) db seed

##@ Containers
list-containers: ## List all containers
	docker compose ps -a

##@ Logs
logs: ## Show logs
	$(COMPOSE) logs

logs-next: ## Show logs for the next container
	$(COMPOSE) logs --since 1m -f next

logs-pg: ## Show logs for the postgres container
	$(COMPOSE) logs postgres

logs-nginx: ## Show logs for the nginx container
	$(COMPOSE) logs nginx --since 1m -f
