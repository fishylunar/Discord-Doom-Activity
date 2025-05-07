# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install concurrently globally to run multiple commands
RUN npm install -g concurrently

# Copy the src directory
COPY src/ /usr/src/app/src/

# Set working directory for the server
WORKDIR /usr/src/app/src/server

# Install dependencies for both client and server
RUN npm install --prefix ../client --include=dev && npm install

# Build the client application
RUN npm run build --prefix ../client

# Expose the unified server port
EXPOSE 3001

# Set the main working directory
WORKDIR /usr/src/app/src/server

# Start the unified application
CMD ["npm", "start"]
