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
  sort_order?: SortOrder | null;
  keyword?: string;
  category_root?: number | null;
  category_child?: number | null;
  category_grand_child?: number | null;
  brand_name?: string;
  // size_group: number | null;
  // size_id: number | null;
  price_min?: number | null;
  price_max?: number | null;
  item_condition_id?: number | null;
  shipping_payer_id?: number | null;
  status_on_sale?: boolean | null;
  status_trading_sold_out?: boolean | null;
  max_hit_items?: number | null;
  last_comment_within?: number | null;
};
