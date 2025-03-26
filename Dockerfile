FROM denoland/deno:2.2.5

WORKDIR /app

USER deno

COPY . .

RUN deno install

CMD ["deno", "task", "prod"]