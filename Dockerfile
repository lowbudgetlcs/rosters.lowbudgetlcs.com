FROM node:22-alpine 
#AS builder
WORKDIR /build
COPY package*.json .
COPY environment.d .

RUN npm ci
#RUN npm prune --omit=dev

COPY . .

RUN npm run build

#FROM node:22-alpine AS deployer

#WORKDIR /app

#COPY --from=builder /build/build ./build
#COPY --from=builder /build/package.json .
#COPY --from=builder /build/node_modules .
#COPY --from=builder /build/environment.d .

EXPOSE 3000

CMD [ "node", "--env-file=environment.d", "build" ] 
