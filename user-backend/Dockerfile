FROM python:3.7
WORKDIR /app
COPY . /app
COPY config.py.example config.py

COPY requirements.txt /app/tmp/
RUN pip install -r /app/tmp/requirements.txt

ENTRYPOINT [ "python" ]
CMD [ "app.py" ]
