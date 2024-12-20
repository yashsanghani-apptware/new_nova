# Node.js Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Copy project files
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Expose the service port
EXPOSE 3004

# Run the service
CMD ["npm", "start"]
