FROM node:18-alpine

RUN mkdir /app

WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git 

RUN mkdir /app/updload

RUN npm install -g create-react-app

RUN create-react-app client
RUN mkdir /app/client/src/components

ADD client/src/index.css /app/client/src/index.css
ADD client/src/App.js /app/client/src/App.js
ADD client/src/components/About.js /app/client/src/components/About.js
ADD client/src/components/AddTask.js /app/client/src/components/AddTask.js
ADD client/src/components/Button.js /app/client/src/components/Button.js
ADD client/src/components/Footer.js /app/client/src/components/Footer.js
ADD client/src/components/Header.js /app/client/src/components/Header.js
ADD client/src/components/Task.js /app/client/src/components/Task.js
ADD client/src/components/Tasks.js /app/client/src/components/Tasks.js

RUN cd client && npm install -f jest-dom user-event json-server react-dom react-icons react-router-dom axios js-file-download

RUN cd client && npm run build

RUN cd ..

RUN npm install express body-parser express-myconnection mysql mariadb express-fileupload cors

ADD server.js /app/

CMD ["npm", "start"]
