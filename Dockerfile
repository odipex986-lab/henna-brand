FROM node:22-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install
WORKDIR /app/artifacts/api-server
EXPOSE 3000
CMD ["node_modules/.bin/tsx", "./src/index.ts"]
