FROM node:10.15.3-alpine

WORKDIR /server

COPY package.json .
COPY package-lock.json .
RUN npm install --no-optional

COPY . .

CMD [ "npm", "start" ]