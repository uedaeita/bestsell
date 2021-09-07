#-----------------------------------------
# SETTINGS
#-----------------------------------------

POETRY = poetry
RUN = @$(POETRY) run

ifeq ($(ENV), LOCAL)
	PYTHON = @$(RUN) python
else
	PYTHON = python
endif

#-----------------------------------------
# TARGETS
#-----------------------------------------

.PHONY: install migrate seed dev debug test lint isort autoflake black mypy

install:
	@$(POETRY) install

migrate:
	@$(RUN) alembic upgrade head

seed:
	@$(PYTHON) -m app.db.seed

dev:
	@$(RUN) uvicorn app.main:app \
			--host 0.0.0.0 \
			--reload

debug:
	sh -c "python -m debugpy --wait-for-client --listen 0.0.0.0:5678 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

test:
	@$(RUN) pytest

lint: isort autoflake black mypy

isort:
	@$(RUN) isort \
			app

autoflake:
	@$(RUN) autoflake \
			--remove-all-unused-imports \
			--recursive \
			--remove-unused-variables \
			--in-place \
			app \
			--exclude=__init__.py

black:
	@$(RUN) black \
			app

mypy:
	@$(RUN) mypy \
			app
