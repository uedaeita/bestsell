import functools
import inspect
from typing import Any, Callable, TypeVar, cast

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from . import deps

FuncT = TypeVar("FuncT", bound=Callable[..., Any])


def managed_transaction(func: FuncT) -> FuncT:
    @functools.wraps(func)
    async def wrap_func(
        *args: Any, db: Session = Depends(deps.get_db), **kwargs: Any
    ) -> Any:
        try:
            if inspect.iscoroutinefunction(func):
                result = await func(*args, db=db, **kwargs)
            else:
                result = func(*args, db=db, **kwargs)
            db.commit()
        except HTTPException as e:
            db.rollback()
            raise e
        # don't close session here, or you won't be able to response
        return result

    return cast(FuncT, wrap_func)
