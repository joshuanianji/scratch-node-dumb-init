# Distroless Node.js Docker Images with Dumb-Init

Multi-architecture distroless Node.js Docker images based off of [`astefanutti/scratch-node`](https://github.com/astefanutti/scratch-node), with [`dumb-init`](https://github.com/Yelp/dumb-init).

Image size is `43.53 MB`.

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
