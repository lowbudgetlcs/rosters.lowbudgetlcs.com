FROM node:22-alpine AS builder
WORKDIR /app

COPY ./package*.json ./
COPY ./.env ./.env
RUN npm ci

COPY ./ ./
RUN npm run build

EXPOSE 3000
ENV NODE_ENV production

CMD [ "node", "-r", "dotenv/config", "build" ] 