#!/bin/sh -ex

# Run Prisma migrations before starting the Fly server
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

npx prisma migrate deploy
npm run start
