# Use an official Ubuntu Xenial as a parent image
FROM ubuntu:18.04

# Install Node.js 8 and npm 5
RUN apt-get update --fix-missing
RUN apt-get -qq update
RUN apt-get install -y tzdata
RUN apt-get install -y build-essential
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get install -y nodejs*
RUN apt-get install -y npm
RUN apt-get install -y vim
RUN apt-get install -y tzdata
RUN apt-get install -y yarn
RUN mkdir /osm_frontend
WORKDIR /osm_frontend
COPY package.json /osm_frontend/
COPY package-lock.json /osm_frontend/
RUN npm install -g n 
RUN npm install -g yarn
#RUN npm install -g nodemon
RUN npm install -g pm2
RUN npm install -g create-react-app
RUN npm install -g env-cmd 
COPY . /osm_frontend

# Add a script to be executed every time the container starts.
EXPOSE 32411

# Start the main process.
#CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]

#CMD ["npm","start", "node_modules/react-scripts/scripts/start.js"]

