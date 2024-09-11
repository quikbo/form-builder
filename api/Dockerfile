# Use an official Node.js runtime as the base image
FROM node:lts-alpine
 
# Set the working directory in the container
WORKDIR /app
 
# Install curl for healthcheck
RUN apk add --no-cache curl
 
# Create the data directory to setup volumes for the database
RUN mkdir -p /app/data
 
# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
 
# Install pnpm
RUN npm install -g pnpm
 
# Install dependencies
RUN pnpm install
 
# Copy the rest of the application code
COPY . .
 
# Build the database
ARG DB_FILE=/app/data/sqlite.db
ENV DB_FILE=${DB_FILE}
RUN pnpm db:generate
RUN pnpm db:migrate
# We don't seed the database in production!
 
# Expose the port the app runs on
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}
 
# Command to run the application
CMD ["pnpm", "run", "start"]