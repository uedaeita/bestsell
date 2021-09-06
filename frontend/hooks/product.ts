import type { Product, SearchArgs } from '@/types/product';
import axios from 'axios';

export const getMercariProducts = async (params: SearchArgs): Promise<Product[]> => {
  const response = await axios.get<Product[]>(`/bestsell/api/products/`, { params: { ...params } });
  return response.data;
};
