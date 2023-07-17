ARG NODE_VERSION=18

FROM alpine:3.18.2 as installer

RUN apk update
RUN apk add wget

# Install dumb-init
# See available architectures: https://github.com/Yelp/dumb-init/releases/tag/v1.2.5
# They seem to use $(dpkg --print-architecture) for the `deb` file
# but interestingly, use `uname -m` for the binary 
RUN wget -O /usr/local/bin/dumb-init "https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_$(uname -m)"
RUN chmod +x /usr/local/bin/dumb-init

FROM astefanutti/scratch-node:${NODE_VERSION} as basic

COPY --from=installer /usr/local/bin/dumb-init /bin/dumb-init

ENTRYPOINT ["/bin/dumb-init", "--"]
