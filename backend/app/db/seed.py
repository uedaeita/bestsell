from os.path import dirname, join

import yaml
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.schema import EcommerceCreate
from app.service import crud

ECOMMERCE_FILE = "ecommerce.yml"


def seed(db: Session) -> None:
    with open(join(dirname(__file__), "master", ECOMMERCE_FILE)) as file:
        ecommerces = yaml.safe_load(file)
        for ecommerce in ecommerces:
            if crud.ecommerce.get_by_code(db=db, code=ecommerce["code"]):
                continue

            ecommerce_in = EcommerceCreate(
                name=ecommerce["name"],
                code=ecommerce["code"],
            )
            crud.ecommerce.create(db=db, obj_in=ecommerce_in)


def main() -> None:
    db = SessionLocal()
    seed(db=db)


if __name__ == "__main__":
    main()
