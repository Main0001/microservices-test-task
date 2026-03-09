FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --omit=dev

# Production image
FROM node:22-slim AS production

# Install Chromium dependencies required by html-pdf-node (Puppeteer)
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use the system Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 3000

CMD ["node", "dist/src/main"]
