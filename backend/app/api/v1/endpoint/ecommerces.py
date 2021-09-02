from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import schema
from app.api import deps
from app.service import crud

router = APIRouter()


@router.get("/", response_model=List[schema.Ecommerce])
def get_ecommerces(
    *,
    db: Session = Depends(deps.get_db),
) -> Any:
    return crud.ecommerce.get_all(db=db)
