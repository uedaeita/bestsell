from typing import Any


def xstr(s: Any) -> str:
    return "" if s is None else str(s)


def xprice(s: str) -> int:
    return int(s.replace("¥", "").replace(",", ""))
