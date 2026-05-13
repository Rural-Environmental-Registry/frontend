# ============================
# 1) Dependencies Stage
# ============================
FROM node:18-alpine AS dependencies

RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache jq

WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ============================
# 2) Build Stage
# ============================
FROM dependencies AS build
COPY . .
ARG APP_VERSION=0.0.0
ENV APP_VERSION=${APP_VERSION}
ARG VITE_BASE_URL=/
ENV VITE_BASE_URL=${VITE_BASE_URL}
RUN npm run build-only && \
    echo "${APP_VERSION}" > dist/version.txt && \
    sh scripts/generate-config.sh

# ============================
# 3) Runtime Stage
# ============================
FROM nginx:alpine

RUN apk update && apk upgrade --no-cache

ARG VITE_BASE_URL=/

# Normalize trailing slash, copy dist, generate nginx.conf — single layer
COPY --from=build /app/dist/ /tmp/dist/
COPY ./nginx.conf.template /tmp/nginx.conf.template
RUN BASE_PATH="${VITE_BASE_URL}" && \
    case "$BASE_PATH" in */) ;; *) BASE_PATH="${BASE_PATH}/";; esac && \
    mkdir -p "/usr/share/nginx/html${BASE_PATH}" && \
    cp -a /tmp/dist/* "/usr/share/nginx/html${BASE_PATH}" && \
    rm -rf /tmp/dist && \
    rm -f /etc/nginx/conf.d/default.conf && \
    sed "s|__BASE_PATH__|${BASE_PATH}|g" /tmp/nginx.conf.template > /etc/nginx/nginx.conf && \
    rm /tmp/nginx.conf.template && \
    mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp \
      /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx && \
    touch /tmp/nginx.pid && \
    chown nginx:nginx /tmp/nginx.pid && \
    chown -R nginx:nginx /var/log/nginx

EXPOSE 8080
USER nginx
