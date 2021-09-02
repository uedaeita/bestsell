import re
from typing import List, Tuple

import requests
from bs4 import BeautifulSoup

from app.constant.common import USER_AGENT
from app.constant.mercari import (
    CATEGORY_ATTR_KEY,
    CATEGORY_ATTR_VAL_REGEX,
    CATEGORY_PATH,
    CATEGORY_URL,
    CATEGORY_WRAP_ATTR_VAL,
    CHILD_CATEGORY_NAME_ATTR_VAL,
    GRAND_CHILD_CATEGORY_WRAP_ATTR_VAL,
)
from app.schema.category import MercariCategoryCreate


def find_mercari_categories() -> List[MercariCategoryCreate]:
    categories = []
    category_roots = __find_all_category_roots()
    for category_root in category_roots:
        inner_root, category_root_name, category_root_id = __scrape_root_category(
            category_root
        )
        categories.append(
            MercariCategoryCreate(
                name=category_root_name,
                category_root_id=category_root_id,
            )
        )
        child_category_name = ""
        for root_child in inner_root.children:
            if CATEGORY_ATTR_KEY not in root_child.attrs:
                continue

            if root_child.attrs[CATEGORY_ATTR_KEY] == CHILD_CATEGORY_NAME_ATTR_VAL:
                child_category_name = root_child.find("h3").text
                continue

            if (
                root_child.attrs[CATEGORY_ATTR_KEY]
                == GRAND_CHILD_CATEGORY_WRAP_ATTR_VAL
            ):
                grand_child_category_root = root_child.find("ul")
                category_child_id = None
                for idx, grand_child_category in enumerate(
                    grand_child_category_root.children
                ):
                    a_tag = grand_child_category.find("a")
                    if idx == 0:
                        category_child_id = __extract_category_id(a_tag)
                        categories.append(
                            MercariCategoryCreate(
                                name=child_category_name,
                                category_root_id=category_root_id,
                                category_child_id=category_child_id,
                            )
                        )
                        continue
                    category_grand_child_id = __extract_category_id(a_tag)
                    categories.append(
                        MercariCategoryCreate(
                            name=a_tag.text,
                            category_root_id=category_root_id,
                            category_child_id=category_child_id,
                            category_grand_child_id=category_grand_child_id,
                        )
                    )

    return categories


def __find_all_category_roots() -> BeautifulSoup:
    headers = {"User-Agent": USER_AGENT}
    response = requests.get(CATEGORY_URL, headers=headers, timeout=20)
    if response.status_code != 200 and response.status_code != 404:
        raise ConnectionError()
    soup = BeautifulSoup(response.content, "lxml")
    soup = soup.find("body")
    return soup.find_all("div", {"name": re.compile(CATEGORY_ATTR_VAL_REGEX)})


def __scrape_root_category(soup: BeautifulSoup) -> Tuple[BeautifulSoup, str, int]:
    inner_root = soup.find("div", {CATEGORY_ATTR_KEY: CATEGORY_WRAP_ATTR_VAL})
    category_root_name = soup.find("h2").text
    a_tag = inner_root.find("a", {"href": re.compile(f"{CATEGORY_PATH}\d+")})
    category_root_id = __extract_category_id(a_tag)
    return inner_root, category_root_name, category_root_id


def __extract_category_id(soup: BeautifulSoup) -> int:
    return int(soup["href"].replace(CATEGORY_PATH, ""))
