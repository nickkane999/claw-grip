FROM node:14-alpine

# Create app directory
WORKDIR /

# Install app dependencies
COPY package*.json ./
#RUN npm ci --only=production
RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "npm", "start" ]