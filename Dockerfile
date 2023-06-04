ARG NODE_VERSION=16
ARG ARCH=amd64

FROM alpine:3.13.5 as installer

RUN apk update
RUN apk add wget

# Install dumb-init
# use dpkg --print-architecture to get the architecture
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

FROM astefanutti/scratch-node:${NODE_VERSION} as basic

COPY --from=installer /usr/local/bin/dumb-init /bin/dumb-init

ENTRYPOINT ["/bin/dumb-init", "--"]
