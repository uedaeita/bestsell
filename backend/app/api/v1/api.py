from fastapi import APIRouter

from app.api.v1.endpoint import ecommerces, categories, products

api_router = APIRouter()

api_router.include_router(ecommerces.router, prefix="/ecommerces", tags=["ecommerces"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
