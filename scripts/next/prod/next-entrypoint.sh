#!/bin/bash

# Exit gracefully
trap "exit" SIGINT
trap "exit" SIGTERM

echo "Installing Prisma CLI"

yarn add prisma --exact

echo "Starting project"

yarn start
