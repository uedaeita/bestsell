FROM node:alpine

RUN mkdir -p /var/www

ENV PORT 3000

WORKDIR /var/www

COPY package.json /var/www
COPY yarn.lock /var/www

RUN yarn install

RUN yarn next telemetry disable

COPY . /var/www

RUN yarn run build

EXPOSE 3000

ENTRYPOINT [ "yarn", "run" ]
