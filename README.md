<p align="center">
  <a href="https://payload.tf">
    <img src="https://payload.tf/logo.svg" alt="payload.tf logo" width="175" height="175">
  </a>
</p>

<h1 align="center">screenshot</h1>

<p align="center">Screenshotting Popular TF2 Services</p>

<p align="center">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT license" />
</p>

# Description

This project is split out from Payload and is intended to provide a set of APIs
and methods to screenshot popular TF2 websites.

## Running

You can run the service locally using [Deno](https://docs.deno.com/runtime/):

```cmd
deno task dev
```

This will install all dependencies, including a chrome browser. If you wish to
use a local binary for chrome instead, use the `CHROME_PATH` environment flag to
the path of the chrome executable.

### Production

This service is ran using Docker. To run locally, first build the service:

```cmd
docker build . -t "screenshot"
```

Then run the container:

```cmd
docker run --name "screenshot" --init -it --rm screenshot
```

# Issues, Questions

Any issues or questions should be posted on GitHub issues, where they can be
more easily tracked. Feature requests are welcome!

# Support this Project

You may back me on my [Patreon](https://www.patreon.com/c43721). Direct
sponsorship of this project can be discussed on Discord (24#7644) or by another
medium.

# Contributing

Before contributing, please make sure no one else has stated against your
proposal. Otherwise, make a Pull Request detailing your proposal and any
relevant code changes. If you are committing code, try to create test cases, as
going foward we'd like to have stable tests.

# Useful Links

- [Main Page](https://payload.tf/)
- [Invite](https://payload.tf/invite)
- [Discord](https://payload.tf/discord)
- [Translation](https://crowdin.com/project/payload)

# OpenTelemetry

You can use the following command for debugging and tracing using the Grafana
LGTM stack:

```cmd
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti -v ${PWD}/lgtm/grafana:/data/grafana -v ${PWD}/lgtm/prometheus:/data/prometheus -v ${PWD}/lgtm/loki:/data/loki -e GF_PATHS_DATA=/data/grafana docker.io/grafana/otel-lgtm:0.9.1
```

# License

This project is [MIT licensed](LICENSE).
