FROM ubuntu:14.04
MAINTAINER Mark "codermango@gmail.com"

RUN apt-get -y update && apt-get upgrade -y gcc && apt-get install -y python2.7-dev
RUN apt-get -y install python-pip

ADD . /code
WORKDIR /code
RUN pip install -r /code/requirements.txt
# RUN sudo pip install --upgrade gensim

CMD python /code/server.py
# CMD python server.py --mongo_host="$mongo_host" --mongo_port=$mongo_port --mongo_db="$mongo_db" --mongo_col="$mongo_col"