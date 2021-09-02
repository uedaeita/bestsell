from typing import Dict, List, Optional

from pydantic import BaseModel


class CategoryBase(BaseModel):
    class Config:
        orm_mode = True

    name: str


class MercariCategory(CategoryBase):
    category_root_id: int
    category_child_id: Optional[int] = None
    category_grand_child_id: Optional[int] = None


class MercariCategoryCreate(MercariCategory):
    pass


class MercariCategoryUpdate(MercariCategory):
    pass


class MercariCategoryView(BaseModel):
    roots: List[MercariCategory]
    child: Dict[int, List[MercariCategory]]  # key: category_root_id
    grand_child: Dict[int, List[MercariCategory]]  # key: category_child_id
