FROM node:23-slim

WORKDIR /app

COPY . .

RUN rm -rf node_modules package-lock.json

RUN npm install -g @angular/cli

RUN npm install

RUN find node_modules -path '*/needle/test/files/*' -delete

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]