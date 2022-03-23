FROM node:13.8.1

WORKDIR /osm_frontend

COPY package.json .

RUN npm install

RUN apt-get install -y tzdata

COPY . /osm_frontend

EXPOSE 32411

CMD ["npm","start", "node_modules/react-scripts/scripts/start.js"]
