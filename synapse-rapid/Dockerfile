FROM node:20-slim

WORKDIR /app

# Install system dependencies for Docker
RUN apt-get update && apt-get install -y \
    curl \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 8002

CMD ["npm", "start"]
