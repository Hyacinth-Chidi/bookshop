# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Provide a dummy DATABASE_URL for prisma generate (not used at runtime)
# Must be set BEFORE npm ci because postinstall runs prisma generate
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install dependencies (postinstall will run prisma generate)
RUN npm ci

COPY . .

# Final Stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Create directory for uploads if you use local storage
RUN mkdir -p uploads

EXPOSE 5001

CMD ["npm", "start"]
