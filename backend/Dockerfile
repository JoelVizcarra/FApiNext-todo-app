FROM python:3.9.9-slim-buster

RUN apt-get -y update && \ 
    apt-get -y upgrade && \
    apt-get -y install libpq-dev gcc

WORKDIR /app

COPY ./requirements.txt /app
RUN pip install -r requirements.txt

COPY . /app
ENV FLASK_APP=main

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]