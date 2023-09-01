FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk update && \
    apk upgrade -U

RUN npm install -f

COPY . .

RUN npm run build

CMD ["node", "dist/main"]
