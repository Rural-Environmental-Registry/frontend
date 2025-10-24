# ============================
# 1) Build Stage
# ============================
FROM node:18-alpine AS builder

RUN apk add --no-cache git 
RUN apk add --no-cache jq

WORKDIR /app

# Copy the project files into the container
COPY package.json package-lock.json ./

ARG GITLAB_TOKEN
ARG HTTP_PROXY
ARG HTTPS_PROXY

RUN git config --global http.proxy "$HTTP_PROXY" && \
  git config --global https.proxy "$HTTPS_PROXY"
RUN git config --global url."https://gitlab-ci-token:${GITLAB_TOKEN}@inovacao.dataprev.gov.br".insteadOf "https://inovacao.dataprev.gov.br"

RUN npm install

COPY . .

ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}

RUN npm run build-only

RUN echo "$APP_VERSION" > dist/version.txt

RUN sh scripts/generate-config.sh

# ============================
# 2) Run Stage
# ============================
FROM nginx:latest

COPY --from=builder /app/dist/ /usr/share/nginx/html/rechml
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80