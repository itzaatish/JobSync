FROM ghcr.io/puppeteer/puppeteer:latest

# Run as root so we can change file permissions
USER root

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all project files
COPY . .

# 🔓 Give write (and read/execute) permissions to everyone for all files
RUN chmod -R 777 .

# Start the application
CMD ["node", "index.js"]
