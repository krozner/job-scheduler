FROM node:22-slim

USER root

# Set the default working directory for the app
# It is a best practice to use the /usr/src/app directory
WORKDIR /usr/src/app

# Install cron
RUN apt update && apt -y install cron
# Create the log file fo all job commands output
RUN touch /var/log/cron.log
# Run the commands on container startup
CMD cron && tail -f /var/log/cron.log
# linux utils (used in bin/cron helper script)
RUN apt-get -y install bsdmainutils

#USER node
# Set necessary environment variables.
ENV NODE_ENV=dev \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin:$PATH

# Create the working directory, including the node_modules folder for the sake of assigning ownership in the next commands
RUN mkdir -p /usr/src/app/node_modules


# Install dependencies.
COPY package*.json ./
RUN npm i
#RUN npm i -g @nestjs/cli
#RUN npm ci --only=production

# Necessary to run before adding application code to leverage Docker cache
RUN npm cache clean --force

RUN mkdir /usr/src/app/var
RUN touch /usr/src/app/var/stdout.log
RUN touch /usr/src/app/var/stderr.log
RUN ln -sf /dev/stdout /usr/src/app/var/stdout.log \
    && ln -sf /dev/stderr /usr/src/app/var/stderr.log

# Expose API port
EXPOSE 3000
