FROM denoland/deno:alpine as builder

WORKDIR /app
COPY . .

RUN deno cache main.ts

FROM denoland/deno:alpine

WORKDIR /app
COPY --from=builder /app .

CMD ["deno", "task", "prod"]