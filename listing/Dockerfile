# Node.js Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json listing/
COPY tsconfig.json listing/
COPY src listing/src

RUN npm install
RUN npm run build

EXPOSE 3002
CMD ["npm", "start"]
