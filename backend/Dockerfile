FROM --platform=linux/amd64 python:3.9.7-slim AS builder

WORKDIR /opt/backend

RUN pip install poetry

COPY pyproject.toml poetry.lock ./

RUN poetry export --dev -f requirements.txt > requirements.txt


FROM --platform=linux/amd64 python:3.9.7-slim

ENV POETRY_VERSION=1.1.11
ENV PYTHONUNBUFFERED=1

WORKDIR /opt/backend

COPY --from=builder /opt/backend/requirements.txt .

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential \
        default-libmysqlclient-dev \
        gcc \
        libgl1 \
        libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install "poetry==$POETRY_VERSION"

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT [ "make" ]
