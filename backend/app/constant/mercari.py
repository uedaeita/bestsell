# Common mercari constants
MERCARI_URL = "https://www.mercari.com"

# Category related constants
CATEGORY_PATH = "/jp/category/"
CATEGORY_URL = f"{MERCARI_URL}{CATEGORY_PATH}"
CATEGORY_ATTR_KEY = "data-test"
CATEGORY_ATTR_VAL_REGEX = "category-\d+"
CATEGORY_WRAP_ATTR_VAL = "category-list-individual-box-inner-box"
CHILD_CATEGORY_NAME_ATTR_VAL = "category-list-individual-box-sub-category-name"
GRAND_CHILD_CATEGORY_WRAP_ATTR_VAL = "category-list-individual-box-sub-sub-category-box"

# Product related constants
SEARCH_PATH = "/jp/search/"
SEARCH_URL = f"{MERCARI_URL}{SEARCH_PATH}"
SEARCH_NOT_FOUND_CLASS = "search-result-description"
PAGE_PRODUCT_WRAP_CLASS = "items-box"
