FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/package-lock.json ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/

RUN npm run install:all

COPY backend ./backend
COPY frontend ./frontend

RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY backend/package.json backend/package-lock.json ./backend/
RUN npm ci --prefix backend --omit=dev

COPY backend/src ./backend/src
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/health || exit 1

CMD ["node", "backend/src/index.js"]
