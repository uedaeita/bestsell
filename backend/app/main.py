from typing import Dict

from fastapi import FastAPI

from app.api.v1.api import api_router

app = FastAPI(
    title="BestSell",
    root_path="/bestsell/api",
)


@app.get("/")
def health_check() -> Dict[str, str]:
    return {"version": "1.0.0"}


app.include_router(api_router)
