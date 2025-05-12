# Step 1: Builder
FROM node:23-alpine AS builder

# Install system dependencies if native packages are needed
RUN apk add --no-cache libc6-compat

# Working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy files
COPY . .

# Install dependencies
RUN pnpm install

# Genera Prisma Client
RUN pnpm prisma generate


# Step 2: Runner
FROM node:23-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm

# Copy only the necessary files from the builder stage
COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "pnpm build:docker:env && pnpm start"]
