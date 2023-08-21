FROM python:3.11.4-alpine3.17

RUN mkdir /app

WORKDIR /app

RUN mkdir /app/updload

RUN apk update && apk upgrade && \
    apk add --no-cache bash git mariadb-connector-c-dev build-base gfortran openblas-dev linux-headers

RUN apk --update add bash 

RUN pip3 install virtualenv

RUN mkdir ve && cd ve && python3.11 -m virtualenv py311 && source py311/bin/activate

RUN pip3 install flask_executor Flask-Debug numpy scipy mariadb==1.1.4 matplotlib pandas wget

RUN mkdir server

ADD server/main.py server/

ADD server/__init__.py server/

ENV FLASK_APP=server
ENV FLASK_DEBUG=1

EXPOSE 5000

#CMD source ve/py311/bin/activate start ; FLASK_DEBUG=1 FLASK_APP=server flask run --host 0.0.0.0
CMD ["flask", "run", "--host", "0.0.0.0"]

