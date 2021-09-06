import type { NextPage } from 'next'
import { Product, SearchArgs, SortOrder } from '@/types/product';
import React, { useState } from 'react'
import { Container, AppBar, Toolbar, IconButton, Typography, FormControl, Input, InputLabel, MenuItem, Select, TextField, Checkbox, FormControlLabel, FormGroup, Button, LinearProgress } from '@material-ui/core';
import { GridOverlay, DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { AccountCircle, Menu } from '@material-ui/icons';
import { useMercariCategory } from '@/hooks/mercariCategory';
import { getMercariProducts } from '@/hooks/product';
import { useMutation } from 'react-query';

type CategoryKey = 'category_root' | 'category_child' | 'category_grand_child';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SORT_OPTIONS = [
  { id: 1, value: '', label: '並び替え' },
  { id: 2, value: 'price_asc', label: '価格の安い順' },
  { id: 3, value: 'price_desc', label: '価格の高い順' },
  { id: 4, value: 'created_asc', label: '出品の新しい順' },
  { id: 5, value: 'like_desc', label: 'いいね!の多い順' }
];

const ITEM_CONDITION_OPTIONS = [
  { id: 1, value: 1, label: 'すべて' },
  { id: 2, value: 2, label: '新品、未使用' },
  { id: 3, value: 3, label: '未使用に近い' },
  { id: 4, value: 4, label: '目立った傷や汚れなし' },
  { id: 5, value: 5, label: 'やや傷や汚れあり' },
  { id: 6, value: 6, label: '傷や汚れあり' },
  { id: 7, value: 7, label: '全体的に状態が悪い' }
];

const SHIPPING_PAYER_OPTIONS = [
  { id: 1, value: 1, label: 'すべて' },
  { id: 2, value: 2, label: '着払い(購入者負担)' },
  { id: 3, value: 3, label: '送料込み(出品者負担)' }
];

const MAX_HIT_ITEM_OPTIONS = [
  { id: 1, value: 25, label: '25件まで' },
  { id: 2, value: 50, label: '50件まで' },
  { id: 3, value: 100, label: '100件まで' },
  { id: 4, value: 200, label: '200件まで' },
  { id: 5, value: 300, label: '300件まで' },
  { id: 6, value: 400, label: '400件まで' },
  { id: 7, value: 500, label: '500件まで' },
  { id: 8, value: 1000, label: '500件まで' },
  { id: 9, value: 10000, label: '500件まで' },
];

const LAST_COMMENT_WITHIN_OPTIONS = [
  { id: 1, value: 1, label: '1日以内' },
  { id: 1, value: 7, label: '1週間以内' },
  { id: 1, value: 14, label: '2週間以内' },
  { id: 1, value: 30, label: '1ヶ月以内' },
  { id: 1, value: 365, label: '1年以内' },
];

const columns: GridColDef[] = [
  { field: 'sold_out', headerName: '売切', type: 'boolean', width: 110 },
  { field: 'name', headerName: '商品名', width: 350 },
  { field: 'like', headerName: 'いいね!数', type: 'number', width: 150 },
  { field: 'commented_at', headerName: '最終コメント日時', type: 'string', width: 200 },
  { field: 'url', headerName: '商品ページURL', type: 'string', width: 200 },
  { field: 'url_photo', headerName: '画像URL', type: 'string', width: 200 },
  { field: 'price', headerName: '値段', type: 'number', width: 120 },
  { field: 'desc', headerName: '説明', width: 400 },
];

export const CustomLoadingOverlay = (): JSX.Element => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

const Mercari: NextPage = () => {
  const [state, setState] = useState<SearchArgs>({
    sort_order: null,
    keyword: '',
    category_root: null,
    category_child: null,
    category_grand_child: null,
    brand_name: '',
    price_min: null,
    price_max: null,
    item_condition_id: null,
    shipping_payer_id: null,
    status_on_sale: false,
    status_trading_sold_out: true,
    max_hit_items: 100,
    last_comment_within: 7
  });
  const [products, setProducts] = useState<Product[]>([]);

  const { data: category, isLoading: isCategoryLoading } = useMercariCategory();

  const { mutate: searchProducts, isLoading } = useMutation(getMercariProducts, {
    onSuccess(data: Product[]) {
      setProducts(data);
    },
    onError(error: any) {
      console.log(error);
    }
  });

  const handleCategoryChange = (key: CategoryKey, value: number) => {
    let params: SearchArgs = { [key]: value };
    if (key === 'category_root' && value !== state.category_root) {
      params = { ...params, category_child: null, category_grand_child: null };
    } else if (key === 'category_child' && value != state.category_child) {
      params = { ...params, category_grand_child: null };
    }
    setState({ ...state, ...params });
  };

  const handleSearch = () => {
    searchProducts(state);
  };

  if (isCategoryLoading) return null;

  return (
    <Container maxWidth="xl" disableGutters>
      <div className="flex-grow">
        <AppBar position="static" color="primary">
          <Toolbar>
            <IconButton edge="start" className="mr-4" color="inherit" aria-label="menu">
              <Menu />
            </IconButton>
            <Typography variant="h6" className="flex-grow" noWrap>
              Best Sell
            </Typography>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Mercari</h2>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-3">
            <FormControl className="">
              <InputLabel id="sort-order-label">並び替え</InputLabel>
              <Select
                labelId="sort-order-label"
                id="sort-order"
                value={state.sort_order}
                onChange={e => setState({ ...state, sort_order: e.target.value as (SortOrder | null) })}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {SORT_OPTIONS.map(opt => (
                  <MenuItem
                    key={opt.id}
                    value={opt.value}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="">
              <TextField
                id="keyword"
                label="キーワード"
                onChange={e => setState({ ...state, keyword: String(e.target.value) })}
              />
            </FormControl>
            <FormControl className="">
              <InputLabel id="max-hit-label">最大取得件数</InputLabel>
              <Select
                labelId="max-hit-label"
                id="max-hit"
                value={state.max_hit_items}
                onChange={e => setState({ ...state, max_hit_items: Number(e.target.value) })}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {MAX_HIT_ITEM_OPTIONS.map(opt => (
                  <MenuItem
                    key={opt.id}
                    value={opt.value}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="">
              <InputLabel id="root-category-label">親カテゴリ</InputLabel>
              <Select
                labelId="root-category-label"
                id="root-category"
                value={state.category_root}
                onChange={e => handleCategoryChange('category_root', Number(e.target.value))}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {category && category.roots.map(rootCategory => (
                  <MenuItem
                    key={rootCategory.category_root_id}
                    value={rootCategory.category_root_id}
                  >
                    {rootCategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="">
              <InputLabel id="child-category-label">子カテゴリ</InputLabel>
              <Select
                labelId="child-category-label"
                id="child-category"
                value={state.category_child}
                onChange={e => handleCategoryChange('category_child', Number(e.target.value))}
                input={<Input />}
                MenuProps={MenuProps}
                disabled={!state.category_root}
              >
                {category && state.category_root && category.child[state.category_root].map(childCategory => (
                  <MenuItem
                    key={childCategory.category_child_id}
                    value={childCategory.category_child_id as number}
                  >
                    {childCategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="">
              <InputLabel id="child-category-label">孫カテゴリ</InputLabel>
              <Select
                labelId="child-category-label"
                id="child-category"
                value={state.category_grand_child}
                onChange={e => handleCategoryChange('category_grand_child', Number(e.target.value))}
                input={<Input />}
                MenuProps={MenuProps}
                disabled={!state.category_child}
              >
                {category && state.category_child && category.grand_child[state.category_child].map(grandChildCategory => (
                  <MenuItem
                    key={grandChildCategory.category_grand_child_id}
                    value={grandChildCategory.category_grand_child_id as number}
                  >
                    {grandChildCategory.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="">
              <TextField
                id="brand-name"
                label="ブランド名"
                onChange={e => setState({ ...state, brand_name: String(e.target.value) })}
              />
            </FormControl>
            <FormControl className="">
              <TextField
                id="price-min"
                label="最低価格"
                onChange={e => setState({ ...state, price_min: Number(e.target.value) })}
              />
            </FormControl>
            <FormControl className="">
              <TextField
                id="price-max"
                label="最高価格"
                onChange={e => setState({ ...state, price_max: Number(e.target.value) })}
              />
            </FormControl>
            <FormControl className="">
              <InputLabel id="item-condition-label">商品の状態</InputLabel>
              <Select
                labelId="item-condition-label"
                id="item-condition"
                value={state.item_condition_id}
                onChange={e => setState({ ...state, item_condition_id: Number(e.target.value) })}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {ITEM_CONDITION_OPTIONS.map(opt => (
                  <MenuItem
                    key={opt.id}
                    value={opt.value}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="">
              <InputLabel id="shipping-payer-label">配送料の負担</InputLabel>
              <Select
                labelId="shipping-payer-label"
                id="shipping-payer"
                value={state.shipping_payer_id}
                onChange={e => setState({ ...state, shipping_payer_id: Number(e.target.value) })}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {SHIPPING_PAYER_OPTIONS.map(opt => (
                  <MenuItem
                    key={opt.id}
                    value={opt.value}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="">
              <InputLabel id="last-comment-within-label">最終コメント日</InputLabel>
              <Select
                labelId="last-comment-within-label"
                id="last-comment-within"
                value={state.last_comment_within}
                onChange={e => setState({ ...state, last_comment_within: Number(e.target.value) })}
                input={<Input />}
                MenuProps={MenuProps}
              >
                {LAST_COMMENT_WITHIN_OPTIONS.map(opt => (
                  <MenuItem
                    key={opt.id}
                    value={opt.value}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={!!state.status_on_sale} onChange={e => setState({ ...state, [e.target.name]: e.target.checked })} name="status_on_sale" />}
                label="販売中"
              />
              <FormControlLabel
                control={<Checkbox checked={!!state.status_trading_sold_out} onChange={e => setState({ ...state, [e.target.name]: e.target.checked })} name="status_trading_sold_out" />}
                label="売り切れ"
              />
            </FormGroup>
            <div></div>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              検索
            </Button>
          </div>
          <div className="w-full h-screen pt-6">
            <DataGrid
              getRowId={row => row.url}
              columns={columns}
              rows={products}
              components={{ LoadingOverlay: CustomLoadingOverlay }}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </Container>
  )
};

export default Mercari;
