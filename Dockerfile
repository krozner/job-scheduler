FROM node:22-slim

USER root

# Install cron
RUN apt update && apt -y install cron
# Create the log file
RUN touch /var/log/cron.log
# Run the command on container startup
CMD cron && tail -f /var/log/cron.log
# linux utils (used in bin/cron helper script)
RUN apt-get install bsdmainutils

USER node
# Set necessary environment variables.
ENV NODE_ENV=dev \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin:$PATH

# Create the working directory, including the node_modules folder for the sake of assigning ownership in the next command
RUN mkdir -p /usr/src/app/node_modules

# Change ownership of the working directory to the node:node user:group
# This ensures that npm install can be executed successfully with the correct permissions
RUN chown -R node:node /usr/src/app

# Set the user to use when running this image
# Non previlage mode for better security (this user comes with official NodeJS image).

# Set the default working directory for the app
# It is a best practice to use the /usr/src/app directory
WORKDIR /usr/src/app

# Copy package.json, package-lock.json
# Copying this separately prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install dependencies.
#RUN npm i -g @nestjs/cli
#RUN npm ci --only=production

# Necessary to run before adding application code to leverage Docker cache
RUN npm cache clean --force
# RUN mv node_modules ../

# Bundle app source
COPY --chown=node:node . ./

# Expose API port
EXPOSE 3000
