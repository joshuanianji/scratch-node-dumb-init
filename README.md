# Distroless Node.js Docker Images with Dumb-Init

Multi-architecture distroless Node.js Docker images based off of [`astefanutti/scratch-node`](https://github.com/astefanutti/scratch-node), with [`dumb-init`](https://github.com/Yelp/dumb-init).

## Usage

`dumb-init` is an entrypoint as `ENTRYPOINT ["/bin/dumb-init", "--"]`, so any CMDs will already have `dumb-init` prepended.

```dockerfile
FROM node as builder

WORKDIR /app

COPY package.json package-lock.json index.js ./

RUN npm install --prod

FROM astefanutti/scratch-node

COPY --from=builder /app /

CMD ["node", "index.js"]
```
