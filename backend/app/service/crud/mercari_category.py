from typing import Callable, List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.model.mercari_category import MercariCategory
from app.schema.category import (
    MercariCategoryCreate,
    MercariCategoryUpdate,
    MercariCategoryView,
)
from app.service.crud.base import CRUDBase

TIER_1 = "category_root_id"
TIER_2 = "category_child_id"
TIER_3 = "category_grand_child_id"


class CRUDMercariCategory(
    CRUDBase[MercariCategory, MercariCategoryCreate, MercariCategoryUpdate]
):
    def get_formatted_categories(self, db: Session) -> MercariCategoryView:
        categories = jsonable_encoder(
            db.query(
                self.model.name,
                self.model.category_root_id,
                self.model.category_child_id,
                self.model.category_grand_child_id,
            )
            .order_by(self.model.id)
            .all()
        )

        vo = MercariCategoryView(
            roots=[],
            child={},
            grand_child={},
        )

        for category in categories:
            # Root categories
            if category[TIER_2] is None and category[TIER_3] is None:
                vo.roots.append(category)
                vo.child[category[TIER_1]] = []
            # Child categories
            elif category[TIER_3] is None:
                vo.child[category[TIER_1]].append(category)
                vo.grand_child[category[TIER_2]] = []
            # Grand child categories
            else:
                vo.grand_child[category[TIER_2]].append(category)

        return vo

    def create_all(
        self,
        db: Session,
        obj_in: List[MercariCategoryCreate],
    ) -> List[MercariCategory]:
        fn: Callable[[MercariCategoryCreate], MercariCategory] = lambda x: MercariCategory(**jsonable_encoder(x))  # type: ignore
        db_obj = map(fn, obj_in)
        db.query(self.model).delete()
        db.bulk_save_objects(list(db_obj))
        db.commit()
        return list(db_obj)


mercari_category = CRUDMercariCategory(MercariCategory)
