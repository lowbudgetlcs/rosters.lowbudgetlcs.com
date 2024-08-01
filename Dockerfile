FROM node:22-alpine
WORKDIR /app

COPY package*.json .
COPY environment.d .env

RUN npm ci

COPY . .

#RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
#CMD [ "node", "--env-file=environment.d", "build" ] 
