# ---- Base Node ---- 
FROM node:alpine

RUN apk add --no-cache nodejs-current tini make gcc g++ python krb5-dev alpine-sdk 

# set working directory 
WORKDIR . 

# Set tini as entrypoint 
ENTRYPOINT ["/sbin/tini", "--"] 
# copy project file 

COPY ./ ./ 

RUN npm install typescript tsc -g 

RUN npm install

# WORKDIR ./dist 

# RUN npm init -y 
RUN apk del make gcc g++ python krb5-dev 

CMD ["npm", "start"]