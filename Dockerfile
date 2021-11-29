FROM node:carbon-slim

# Create app directory
WORKDIR /api_gateway

# Install app dependencies
COPY package.json /api_gateway/
RUN npm install

# Bundle app source
COPY . /api_gateway/
RUN npm run prepublish

CMD [ "npm", "run", "runServer" ]