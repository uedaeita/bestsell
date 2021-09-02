from datetime import datetime, timedelta
from time import sleep
from typing import List, Tuple, Union

import requests
from bs4 import BeautifulSoup

from app.constant.common import USER_AGENT
from app.constant.mercari import (
    MERCARI_URL,
    PAGE_PRODUCT_WRAP_CLASS,
    SEARCH_NOT_FOUND_CLASS,
    SEARCH_URL,
)
from app.schema.product import Product, SearchArgs
from app.util.string_util import xprice, xstr


class Mercari:
    def fetch_all_items(self, search_args: SearchArgs) -> List[str]:
        item_urls = []
        url_base = Mercari.__search_url_base(search_args=search_args)
        for page_id in range(1, int(1e9)):
            urls = self.fetch_page_item_urls(url=f"{url_base}&page={page_id}")

            if len(urls) == 0:
                break

            item_urls.extend(urls)

            if search_args.max_hit_items and search_args.max_hit_items < len(item_urls):
                break
            sleep(2)
        return item_urls

    def fetch_page_item_urls(self, url: str) -> List[str]:
        soup = Mercari.__fetch_soup(url=url)
        not_found_tag = soup.find("p", {"class": SEARCH_NOT_FOUND_CLASS})
        if not_found_tag:
            return []
        items = soup.find_all("section", {"class": PAGE_PRODUCT_WRAP_CLASS})
        return [f"{MERCARI_URL}{item.find('a').attrs['href']}" for item in items]

    def get_item_info(
        self, url: str, last_comment_within: int = None
    ) -> Union[Product, None]:
        soup = Mercari.__fetch_soup(url=url)
        soup = soup.find("body")

        commented_at, is_within = Mercari.__scrape_last_commented_at(
            soup=soup, within_days=last_comment_within
        )
        if not is_within:
            return None

        price = Mercari.__scrape_price(soup=soup)
        name = Mercari.__scrape_name(soup=soup)
        desc = Mercari.__scrape_description(soup=soup)
        sold_out = Mercari.__scrape_sold_out(soup=soup)
        photo = Mercari.__scrape_photo_url(soup=soup)
        like = Mercari.__scrape_like_count(soup=soup)
        item = Product(
            name=name,
            price=price,
            desc=desc,
            sold_out=sold_out,
            url_photo=photo,
            url=url,
            like=like,
            commented_at=commented_at,
        )
        return item

    @classmethod
    def __fetch_soup(cls, url: str) -> BeautifulSoup:
        headers = {"User-Agent": USER_AGENT}
        response = requests.get(url, headers=headers, timeout=20)
        if response.status_code != 200 and response.status_code != 404:
            raise ConnectionError()
        return BeautifulSoup(response.content, "lxml")

    @classmethod
    def __search_url_base(cls, search_args: SearchArgs) -> str:
        url = f"{SEARCH_URL}?sort_order={search_args.sort_order}"
        url += f"&keyword={search_args.keyword}"
        url += f"&category_root={xstr(search_args.category_root)}"
        url += f"&category_child={xstr(search_args.category_child)}"
        if search_args.category_grand_child is not None:
            url += f"&category_grand_child=%5B{search_args.category_grand_child}%5D=1"
        url += f"&brand_name={search_args.brand_name}"
        # if search_args.size_group is not None:
        #     url += f"&size_group={search_args.size_group}"
        # if search_args.size_id is not None:
        #     url += f"&size_id=%5B{search_args.size_id}%5D=1"
        url += f"&price_min={xstr(search_args.price_min)}"
        url += f"&price_min={xstr(search_args.price_max)}"
        if search_args.item_condition_id is not None:
            url += f"&item_condition_id=%5B{search_args.item_condition_id}%5D=1"
        if search_args.shipping_payer_id is not None:
            url += f"&shipping_payer_id=%5B{search_args.shipping_payer_id}%5D=1"
        if (
            search_args.status_on_sale is True
            and search_args.status_trading_sold_out is True
        ):
            url += "&status_all=1"
        if search_args.status_on_sale is not None:
            url += f"&status_on_sale={int(search_args.status_on_sale)}"
        if search_args.status_trading_sold_out is not None:
            url += (
                f"&status_trading_sold_out={int(search_args.status_trading_sold_out)}"
            )
        return url

    @classmethod
    def __scrape_name(cls, soup: BeautifulSoup) -> str:
        return soup.find("h1", {"class": "item-name"}).text

    @classmethod
    def __scrape_price(cls, soup: BeautifulSoup) -> int:
        return xprice(soup.find("span", {"class": "item-price bold"}).text)

    @classmethod
    def __scrape_description(cls, soup: BeautifulSoup) -> str:
        return soup.find("p", {"class": "item-description-inner"}).text

    @classmethod
    def __scrape_sold_out(cls, soup: BeautifulSoup) -> bool:
        sold_out = soup.find("div", {"class": "item-sold-out-badge"})
        return sold_out is not None

    @classmethod
    def __scrape_photo_url(cls, soup: BeautifulSoup) -> str:
        photo = soup.find("div", {"class": "item-photo"})
        return photo.find("img").attrs["data-src"]

    @classmethod
    def __scrape_like_count(cls, soup: BeautifulSoup) -> int:
        return int(soup.find("span", {"data-num": "like"}).text)

    @classmethod
    def __scrape_last_commented_at(
        cls, soup: BeautifulSoup, within_days: int = None
    ) -> Tuple[Union[str, None], bool]:
        is_within = True
        times = soup.find_all("time")
        if len(times) == 0:
            return None, is_within

        commented_at = times[-1].find("span").text

        days, hours, minutes, seconds = 0, 0, 0, 0
        if "日前" in commented_at:
            days = int(commented_at[:-3])
        elif "時間前" in commented_at:
            hours = int(commented_at[:-4])
        elif "分前" in commented_at:
            minutes = int(commented_at[:-3])
        elif "秒前" in commented_at:
            seconds = int(commented_at[:-3])

        now = datetime.utcnow()
        delta = timedelta(days=days, hours=hours, minutes=minutes, seconds=seconds)
        commented_at = now - delta

        if within_days is not None and timedelta(days=within_days) < delta:
            is_within = False

        commented_at = commented_at.strftime("%Y/%m/%d %H:%M:%S")

        return commented_at, is_within
