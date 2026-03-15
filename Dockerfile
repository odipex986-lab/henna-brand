FROM node:22-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN pnpm install
EXPOSE 3000
CMD ["pnpm", "--filter", "@workspace/api-server", "dev"]
