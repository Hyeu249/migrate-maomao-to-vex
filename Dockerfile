FROM node:16.19.1-alpine3.17 as builder
WORKDIR /app
COPY ./ ./
run yarn

FROM node:16.19.1-alpine3.17
WORKDIR /app
COPY --from=builder /app ./
ENTRYPOINT ["yarn", "start"]