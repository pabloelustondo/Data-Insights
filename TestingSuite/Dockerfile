# ---- Base Node ----
FROM alpine:3.5

RUN apk add --no-cache nodejs-current tini make gcc g++ python krb5-dev

# set working directory
WORKDIR .

# Set tini as entrypoint
#ENTRYPOINT ["/sbin/tini", "--"]
# copy project file

COPY ./ ./

RUN npm install jsonwebtoken && npm install kafka-node && npm install -g cucumber && npm install

RUN apk del make gcc g++ python krb5-dev

# CMD ["./node_modules/.bin/cucumberjs -f pretty features/CB-425.feature features/CB-438.feature"]