# Use an official Node.js image as a build environment
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the React app’s source code
COPY . .

# Build the React app for production
RUN npm run build

# Use an Nginx image to serve the build
FROM nginx:alpine

# Copy the build output to Nginx's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx uses
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]