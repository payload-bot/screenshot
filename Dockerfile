FROM denoland/deno:alpine AS builder

WORKDIR /app
COPY . .

RUN deno cache main.ts

FROM denoland/deno:alpine

WORKDIR /app
COPY --from=builder /app .

CMD ["deno", "task", "prod"]