FROM alpine:3.13.5 as installer

RUN apk update
RUN apk add wget

# Install dumb-init
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

FROM astefanutti/scratch-node:16 as basic

COPY --from=installer /usr/local/bin/dumb-init /bin/dumb-init

ENTRYPOINT ["/bin/dumb-init", "--"]
