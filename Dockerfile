# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install concurrently globally to run multiple commands
RUN npm install -g concurrently

# Environment variables
# These can be overridden at runtime (e.g., docker run -e SERVER_PORT=3005 ...)
ENV NODE_ENV=production
ENV SERVER_PORT=3001
# Port for the client's preview server
ENV CLIENT_PORT=8080

# --- IMPORTANT ---
# The following environment variables MUST be provided at runtime for the application to function correctly:
# VITE_DISCORD_CLIENT_ID
# DISCORD_CLIENT_SECRET
# Example: docker run -e VITE_DISCORD_CLIENT_ID=your_id -e DISCORD_CLIENT_SECRET=your_secret ...

# --- Client Setup ---
# Copy the entire client directory
COPY client/ /usr/src/app/client/
# Set working directory for client
WORKDIR /usr/src/app/client
# Install client dependencies, including devDependencies
RUN npm install --include=dev
# Build the client application
RUN npm run build

# --- Server Setup ---
# Copy the entire server directory
COPY server/ /usr/src/app/server/
# Set working directory for server
WORKDIR /usr/src/app/server
# Install server dependencies
RUN npm install

# --- Expose Ports ---
# Expose the server port (defined by SERVER_PORT)
EXPOSE ${SERVER_PORT}
# Expose the client preview port (defined by CLIENT_PORT)
EXPOSE ${CLIENT_PORT}

# --- Start Command ---
# Set the main working directory
WORKDIR /usr/src/app

# Start both the server and the client preview server.
# - "-k" or "--kill-others": Kill other processes if one exits.
# - "--names": Add prefixes to the output for clarity.
# The server's start script (npm start in server/package.json) will be used.
# The client's preview script (npm run preview in client/package.json) will be used with the specified port.
# Note: Ensure your server.js uses process.env.SERVER_PORT as suggested.
CMD ["concurrently", "-k", "--names", "SERVER,CLIENT", "npm:start --prefix server", "npm:preview --prefix client -- --port 4173"]
