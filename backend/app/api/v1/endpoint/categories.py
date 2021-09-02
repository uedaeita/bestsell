from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schema
from app.api import deps
from app.service import crud
from app.service.scrape import category as scrape_category

router = APIRouter()


@router.get("/", response_model=schema.MercariCategoryView)
def get_categories(*, db: Session = Depends(deps.get_db)) -> Any:
    return crud.mercari_category.get_formatted_categories(db=db)


@router.post("/", response_model=List[schema.MercariCategory])
def update_categories(
    *,
    db: Session = Depends(deps.get_db),
) -> Any:
    categories = scrape_category.find_mercari_categories()
    crud.mercari_category.create_all(db=db, obj_in=categories)
    return categories
