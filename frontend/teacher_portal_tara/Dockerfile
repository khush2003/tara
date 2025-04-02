FROM node:22

WORKDIR /usr/src/app

ENV PORT=8081
ENV HOST=0.0.0.0

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8081

CMD ["npm", "run", "preview"]

