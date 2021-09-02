import type { Ecommerce } from '@/types/ecommerce';
import axios, { AxiosError } from 'axios';
import { QueryObserverResult, useQuery } from 'react-query';

const CACHE_KEY = 'ECOMMERCE';

export const getEcommerces = () => async (): Promise<Ecommerce[]> => {
  const response = await axios.get<Ecommerce[]>(`/bestsell/api/ecommerces/`);
  return response.data;
};

export const useEcommerces = (): QueryObserverResult<Ecommerce[], AxiosError> => {
  return useQuery<Ecommerce[], AxiosError>([CACHE_KEY], getEcommerces());
};
