FROM node:22-alpine

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install

COPY  . .

RUN npm run build

EXPOSE 4173

CMD [ "npm ","run","preview" ]
