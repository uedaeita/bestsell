export type MercariCategory = {
  name: string;
  category_root_id: number;
  category_child_id: number | null;
  category_grand_child_id: number | null;
};

export type MercariCategoryView = {
  roots: MercariCategory[];
  child: { [key: number]: MercariCategory[] }; // key: category_root_id
  grand_child: { [key: number]: MercariCategory[] }; // category_child_id
};
