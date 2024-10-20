FROM node:21-alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
COPY ./kysely.config.ts .
COPY ./src/lib/server/migrations ./src/lib/server/migrations

RUN npm ci
ENTRYPOINT ["npm", "run", "db", "migrate", "latest", "--", "--all"]
