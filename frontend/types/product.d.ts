export type Product = {
  name: string;
  price: number;
  desc: string;
  sold_out: boolean;
  url_photo: string;
  url: string;
  like: number;
  commented_at: string;
};

export type SortOrder = 'price_asc' | 'price_desc' | 'created_asc' | 'like_desc';

export type SearchArgs = {
  sort_order: SortOrder;
  keyword: string;
  category_root: number;
  category_child: number;
  category_grand_child: number;
  brand_name: string;
  // size_group: number;
  // size_id: number;
  price_min: number;
  price_max: number;
  item_condition_id: number;
  shipping_payer_id: number;
  status_on_sale: boolean;
  status_trading_sold_out: boolean;
  max_hit_items: number;
  last_comment_within: number;
};
