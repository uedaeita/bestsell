from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schema
from app.api import deps
from app.service.scrape.mercari import Mercari

router = APIRouter()


@router.get("/", response_model=List[schema.Product])
def get_products(
    *,
    db: Session = Depends(deps.get_db),
    search_args: schema.SearchArgs = Depends(),
) -> Any:
    mercari = Mercari()
    urls = mercari.fetch_all_items(search_args=search_args)
    products = []
    for url in urls:
        product = mercari.get_item_info(
            url=url, last_comment_within=search_args.last_comment_within
        )
        if product is not None:
            products.append(product)
    return products
