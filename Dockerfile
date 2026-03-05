# Stage 1: Build frontend
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Backend + serve frontend
FROM node:20-alpine
WORKDIR /app

# Install backend deps
COPY server/package*.json ./server/
RUN cd server && npm ci --production

# Copy backend source
COPY server/ ./server/

# Copy built frontend
COPY --from=frontend /app/dist ./dist

# Create data directories
RUN mkdir -p server/data server/uploads

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server/index.js"]
