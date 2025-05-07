# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install concurrently globally to run multiple commands
RUN npm install -g concurrently

# --- Client Setup ---
# Copy the client directory
COPY client/ /usr/src/app/client/
# Set working directory for client
WORKDIR /usr/src/app/client
# Install client dependencies, including devDependencies
RUN npm install --include=dev
# Build the client application
RUN npm run build

# --- Server Setup ---
# Copy the server directory
COPY server/ /usr/src/app/server/
# Set working directory for server
WORKDIR /usr/src/app/server
# Install server dependencies
RUN npm install

# --- Expose Ports ---
# Expose the server port (3001) and client preview port (8080)
EXPOSE 3001
EXPOSE 8080

# --- Start Command ---
# Set the main working directory
WORKDIR /usr/src/app

# Start both the server and the client preview server
CMD ["concurrently", "npm:start --prefix server", "npm:preview --prefix client -- --port 8080"]
