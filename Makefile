include .env

.DEFAULT_GOAL:=help
PWD=$(shell pwd)
COMPOSE=docker compose
EXECNEXT=$(COMPOSE) exec next
EXECNODE=$(COMPOSE) exec node
EXECPG=$(COMPOSE) exec postgres
EXECMONGO_RS0=$(COMPOSE) exec mongo-rs0
EXECMONGO_RS1=$(COMPOSE) exec mongo-rs1
MONGO_AUTH_STRING=-u ${MONGO_INITDB_ROOT_USERNAME} -p ${MONGO_INITDB_ROOT_PASSWORD}
EXECMONGO_RS0_SHELL=$(EXECMONGO_RS0) mongosh $(MONGO_AUTH_STRING)
EXECMONGO_RS1_SHELL=$(EXECMONGO_RS1) mongosh $(MONGO_AUTH_STRING) --port ${MONGO_RS1_PORT:?err}

## All commands available in the Makefile

##@ Helper
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nAll commands available in the Makefile\n \nUsage:\n  make \033[36m<target>\033[0m\n"} /^[.a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Starting/stopping the project

start: force-disconnect build up-recreate ## Force disconnect, build and start containers project

build: ## Build containers project
	$(COMPOSE) build --force-rm

up: ## Start the project
	$(COMPOSE) up -d --remove-orphans

up-recreate: ## Start the project and recreate the containers
	$(COMPOSE) up -d --remove-orphans --force-recreate

stop: ## Stop containers project
	$(COMPOSE) stop

down: force-disconnect ## Stop and remove containers project
	$(COMPOSE) down

restart: ## Restart containers project
	$(COMPOSE) restart

force-disconnect: ## Force stop and disconnect containers from networks
	@echo "Force stopping and disconnecting containers..."
	docker ps -q --filter network=cryptnews_mongo-cluster | xargs -r docker stop
	docker network inspect -f '{{range .Containers}}{{.Name}}{{"\n"}}{{end}}' cryptnews_mongo-cluster | xargs -I {} docker network disconnect cryptnews_mongo-cluster {}

clean: down ## Clean up Docker system
	docker network prune -f
	docker volume prune -f
	docker system prune -af

##@ SSH
ssh: ## SSH into the next container
	$(EXECNEXT) bash

ssh-pg: ## SSH into the postgres container
	$(EXECPG) bash

ssh-mongo-rs0: ## SSH into the mongo-rs0 container
	$(EXECMONGO_RS0) bash

ssh-mongo-rs1: ## SSH into the mongo-rs1 container
	$(EXECMONGO_RS1) bash

ssh-node: ## SSH into the node container
	$(EXECNODE) bash

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

##@ Database
db-reset: db-drop db-create db-pull ## Reset the database

db-drop: ## Drop the database
	$(EXECPG) dropdb ${POSTGRES_DB}

db-create: ## Create the database
	$(EXECPG) createdb ${POSTGRES_DB} && $(EXECNEXT) yarn prisma db push

db-pull: ## Pull the database
	$(EXECNEXT) yarn prisma db pull

db-migrate: ## Migrate the database
	$(EXECNEXT) yarn prisma migrate dev;

db-create-migration: ## Create database migration
	@echo "Please enter the migration name:"; \
	read name; \
	$(EXECNEXT) yarn prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script > down.sql; \
	$(EXECNEXT) yarn prisma migrate dev --create-only --name $$name;\
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
    	  $(EXECNEXT) yarn prisma db execute --file "$$matching_folder/down.sql" --schema prisma/schema.prisma; \
    	  $(EXECNEXT) yarn prisma migrate resolve --rolled-back "$$migration_name"; \
    	else \
    	  echo "No matching migration folder found for: $$name"; \
    	  exit 1; \
    	fi

db-seed: ## Seed the database
	$(EXECNEXT) yarn prisma db seed

##@ MongoDB
mongo-generate-keyfile: ## Generate the keyfile for the mongo cluster
	openssl rand -base64 756 > rs_keyfile
	chmod 600 rs_keyfile

build-mongo: ## Build the mongo container
	$(COMPOSE) build --force-rm mongo-rs0

up-recreate-mongo: ## Recreate the mongo container
	$(COMPOSE) up -d mongo-rs0

start-mongo: build-mongo up-recreate-mongo ## Start the mongo container

mongo-shell-rs0: ## Open the mongo shell
	$(EXECMONGO_RS0_SHELL)

mongo-shell-rs1: ## Open the mongo shell
	$(EXECMONGO_RS1_SHELL)

mongo-stats: ## Show the mongo stats
	$(EXECMONGO_RS0) mongostat $(MONGO_AUTH_STRING) --authenticationDatabase ${MONGO_INITDB_DATABASE}

mongo-repl-status: ## Show the mongo replica set status
	$(EXECMONGO_RS0_SHELL) --eval "rs.status();"

##@ Node server
build-node: ## Build the node container
	$(COMPOSE) build --force-rm node

up-recreate-node: ## Recreate the node container
	$(COMPOSE) up -d node

start-node: build-node up-recreate-node ## Start the node container

node-test: ## Run the node tests
	$(EXECNODE) npm run test

##@ Containers
list-containers: ## List all containers
	docker compose ps -a

##@ Logs
logs: ## Show logs
	$(COMPOSE) logs

logs-mongo-rs0: ## Show logs for the mongo-rs0 container
	$(COMPOSE) logs mongo-rs0 --since 1m -f

logs-mongo-rs1: ## Show logs for the mongo-rs1 container
	$(COMPOSE) logs mongo-rs1 --since 1m -f

logs-next: ## Show logs for the next container
	$(COMPOSE) logs --since 1m -f next

logs-pg: ## Show logs for the postgres container
	$(COMPOSE) logs postgres --since 1m -f

logs-node: ## Show logs for the node container
	$(COMPOSE) logs --since 1m -f node
