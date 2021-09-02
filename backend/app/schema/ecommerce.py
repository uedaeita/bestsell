from pydantic import BaseModel, Field


class EcommerceBase(BaseModel):
    class Config:
        orm_mode = True

    name: str = Field("", description="Eコマース名")
    code: str = Field("", description="Eコマースコード")


class EcommerceCreate(EcommerceBase):
    pass


class EcommerceUpdate(EcommerceBase):
    pass


class Ecommerce(EcommerceBase):
    id: int
