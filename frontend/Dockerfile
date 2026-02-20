FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose frontend port
EXPOSE 5173

# Start command (Vite dev server)
CMD ["npm", "run", "dev"]
