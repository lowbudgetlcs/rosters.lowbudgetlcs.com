FROM node:22-alpine AS builder
WORKDIR /build
COPY package*.json .

RUN npm ci
#RUN npm prune --omit=dev

COPY . .

RUN npm run build

FROM node:22-alpine AS deployer

WORKDIR /app

COPY --from=builder /build/build build/
COPY --from=builder /build/package.json .

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "-r", "dotenv/config", "build" ] 
