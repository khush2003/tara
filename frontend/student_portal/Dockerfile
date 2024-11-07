FROM node:22

WORKDIR /usr/src/app

ENV PORT=8080
ENV HOST=0.0.0.0

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
