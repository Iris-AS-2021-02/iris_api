FROM node:carbon-slim

# Create app directory
WORKDIR /iris_api

# Install app dependencies
COPY package.json /iris_api/
RUN npm install

# Bundle app source
COPY . /iris_api/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]