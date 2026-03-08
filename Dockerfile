FROM node:20-alpine

WORKDIR /app

COPY server/package.json server/package-lock.json* ./server/
RUN npm --prefix ./server install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]
