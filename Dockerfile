# Stage 1: Build the Vue app using Vite
FROM node:22 AS build-stage
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the built app using Node.js
FROM node:22 AS serve-stage
WORKDIR /app

# Copy the built files and the server script
COPY --from=build-stage /app/dist ./dist
COPY server.js .

# Install Express to serve the app
RUN npm install express

# Expose the desired port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
