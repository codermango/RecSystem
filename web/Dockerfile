FROM ubuntu:14.04
MAINTAINER Mark "codermango@gmail.com"

RUN apt-get -y update && apt-get install -y npm
RUN apt-get -y install git

ADD . /code
WORKDIR /code

RUN sudo npm install node

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN sudo npm install 
RUN npm install grunt-cli --save-dev
RUN npm install bower
RUN node_modules/bower/bin/bower --allow-root install

CMD sudo node_modules/grunt-cli/bin/grunt serve