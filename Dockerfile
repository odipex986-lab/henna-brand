FROM node:22-bookworm-slim
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install
RUN cd artifacts/al-mehandi && BASE_PATH=/ PORT=3000 pnpm build
WORKDIR /app/artifacts/api-server
EXPOSE 3000
CMD ["sh", "-c", "cd /app/lib/db && pnpm exec drizzle-kit push --force && cd /app/artifacts/api-server && node_modules/.bin/tsx ./src/index.ts"]
