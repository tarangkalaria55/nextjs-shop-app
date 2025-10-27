FROM node:22.21.0-alpine3.21

WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --include=optional

# Copy application source AFTER npm install
COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
