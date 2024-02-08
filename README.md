# NOTE: This repo is pretty much useless

Docker has built-in init processes already, just use the `--init` flag when running `docker run` to use [tini](https://github.com/krallin/tini). You don't need these images!

# Distroless Node.js Docker Images with Dumb-Init

Multi-architecture distroless Node.js Docker images based off of [`astefanutti/scratch-node`](https://github.com/astefanutti/scratch-node). Adds the [`dumb-init`](https://github.com/Yelp/dumb-init) binary.

## Metadata

<!--METADATA-->
| Tags | Size | Architectures |
| ---- | ---- | ------------- |
| `latest` `18` `18.10` `18.10.0` | 45.33 MiB | `amd64` `arm64` | 
| `16` `16.14` `16.14.2` | 41.02 MiB | `amd64` `arm64` | 
| `14` `14.17` `14.17.0` | 39.87 MiB | `amd64` `arm64` | 
| `12` `12.22` `12.22.1` | 37.98 MiB | `amd64` `arm64` | 
| `10` `10.22` `10.22.0` | 32.55 MiB | `amd64` `arm64` | 
| `8` `8.17` `8.17.0` | 28.79 MiB | `amd64` `arm64` | 
<!--END METADATA-->

## Motivation

I want really small docker images to run my node apps, but and I also want to use `dumb-init` to correctly handle `SIGINTS` and other stuff.

## Usage

`dumb-init` is an entrypoint as `ENTRYPOINT ["/bin/dumb-init", "--"]`, so any CMDs *should* already have `dumb-init` prepended.

```dockerfile
FROM node as builder

WORKDIR /app

COPY package.json package-lock.json index.js ./

RUN npm install --prod

FROM ghcr.io/joshuanianji/scratch-node:16.12.0

COPY --from=builder /app /

CMD ["node", "index.js"]
```
