# Base image
FROM node:22-slim


WORKDIR /app
# Install OpenSSL (and optionally ca-certificates)
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    apt-get clean


COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# Generate Prisma client inside the same env
RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/index.js"]

