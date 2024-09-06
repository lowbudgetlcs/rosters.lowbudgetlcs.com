FROM node:22-bookworm-slim AS builder
ENV NODE_ENV=production
WORKDIR /app

COPY ./package*.json ./
RUN npm i

COPY ./ ./
RUN npm run build

FROM node:22-bookworm-slim

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000

CMD [ "node", "build" ] 