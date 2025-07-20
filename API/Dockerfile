FROM ghcr.io/puppeteer/puppeteer:latest

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Give permissions to work with files (especially for uploads)
RUN mkdir -p /usr/src/app/uploads && chmod -R 777 /usr/src/app/uploads

COPY package*.json ./
RUN npm ci

COPY . .

# Optional: ensure script has execution rights
RUN chmod -R 777 .

CMD ["node", "index.js"]
