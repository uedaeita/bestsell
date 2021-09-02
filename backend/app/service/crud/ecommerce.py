from typing import Optional

from sqlalchemy.orm import Session

from app.model.ecommerce import Ecommerce
from app.schema.ecommerce import EcommerceCreate, EcommerceUpdate
from app.service.crud.base import CRUDBase


class CRUDEcommerce(CRUDBase[Ecommerce, EcommerceCreate, EcommerceUpdate]):
    def get_by_code(self, db: Session, code: str) -> Optional[Ecommerce]:
        return db.query(self.model).filter(self.model.code == code).first()


ecommerce = CRUDEcommerce(Ecommerce)
