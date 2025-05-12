# Etapa 1: Build
FROM node:23-alpine AS builder

# Instal·lació de dependències del sistema si calen paquets nadius
RUN apk add --no-cache libc6-compat

# Directori de treball
WORKDIR /app

# Instal·la pnpm globalment
RUN npm install -g pnpm

# Copia fitxers
COPY . .


# Instal·la dependències
RUN pnpm install

# Genera Prisma Client
RUN pnpm prisma generate

# # Compila Next.js
# RUN pnpm build

# Etapa 2: Runtime
FROM node:23-alpine AS runner

WORKDIR /app
RUN npm install -g pnpm

# Copiem la build i node_modules
COPY --from=builder /app ./

EXPOSE 3000

CMD ["sh", "-c", "pnpm build:docker:env && pnpm start"]
