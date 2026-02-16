FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build TypeScript for production
RUN npm run build

EXPOSE 8001

CMD ["npm", "start"]
