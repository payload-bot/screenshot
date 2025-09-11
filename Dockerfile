FROM denoland/deno:ubuntu-2.5.0 AS build

WORKDIR /app

USER deno

COPY . .

RUN deno cache --frozen main.ts

FROM denoland/deno:ubuntu-2.5.0

EXPOSE 8000
ENV HEADLESS=true
ENV CHROME_PATH="/usr/bin/google-chrome-stable"

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update -qq \
    && apt-get install --no-install-recommends -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf  \
    && rm -rf /var/lib/apt/lists /var/cache/apt/archives

WORKDIR /app

USER deno

COPY --from=build $DENO_DIR $DENO_DIR
COPY --from=build /app .

ENTRYPOINT ["deno", "task", "prod"]