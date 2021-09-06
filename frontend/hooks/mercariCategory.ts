import type { MercariCategoryView } from '@/types/category';
import axios, { AxiosError } from 'axios';
import { QueryObserverResult, useQuery } from 'react-query';

const CACHE_KEY = 'MERCARI_CATEGORY';

export const getMercariCategory = () => async (): Promise<MercariCategoryView> => {
  const response = await axios.get<MercariCategoryView>(`/bestsell/api/categories/`);
  return response.data;
};

export const useMercariCategory = (): QueryObserverResult<MercariCategoryView, AxiosError> => {
  return useQuery<MercariCategoryView, AxiosError>([CACHE_KEY], getMercariCategory());
};
