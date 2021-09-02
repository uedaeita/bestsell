from enum import Enum
from typing import Optional, Union

from pydantic import BaseModel, Field


class SortOrder(str, Enum):
    PRICE_ASC = "price_asc"
    PRICE_DESC = "price_desc"
    CREATED_DESC = "created_desc"
    LIKE_DESC = "like_desc"


class Product(BaseModel):
    name: str
    price: Union[int, str]
    desc: str
    sold_out: bool
    url_photo: str
    url: str
    like: int
    commented_at: str


class SearchArgs(BaseModel):
    class Config:
        orm_mode = True

    sort_order: Optional[SortOrder] = Field(None, description="並び替え")
    keyword: Optional[str] = Field(None, description="検索キーワード")
    category_root: Optional[int] = Field(None, description="カテゴリーID")
    category_child: Optional[int] = Field(None, description="サブカテゴリーID")
    category_grand_child: Optional[int] = Field(None, description="サブサブカテゴリーID")
    brand_name: Optional[str] = Field(None, description="ブランド名")
    # size_group: Optional[int] = Field(None, description="サイズグループID")
    # size_id: Optional[int] = Field(None, description="サイズID")
    price_min: Optional[int] = Field(None, description="最低価格")
    price_max: Optional[int] = Field(None, description="最高価格")
    item_condition_id: Optional[int] = Field(None, description="商品状態ID")
    shipping_payer_id: Optional[int] = Field(None, description="配送料負担ID")
    status_on_sale: Optional[bool] = Field(False, description="販売状況が販売中のみ")
    status_trading_sold_out: Optional[bool] = Field(True, description="販売状況が売り切れのみ")
    max_hit_items: Optional[int] = Field(100, description="検索ヒット数上限")
    last_comment_within: Optional[int] = Field(None, description="最新コメント日以内")
