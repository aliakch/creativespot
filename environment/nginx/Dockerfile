FROM nginx:stable-alpine

RUN apk add --no-cache \
    tzdata \
    curl \
    ca-certificates \
    certbot \
    && mkdir -p /var/lib/letsencrypt/.well-known