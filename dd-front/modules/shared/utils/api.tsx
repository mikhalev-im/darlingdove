import fetch from 'isomorphic-unfetch';
import { stringify } from 'query-string';
import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const SERVER_BASE_URL = serverRuntimeConfig.SERVER_BASE_URL;
const CLIENT_BASE_URL = publicRuntimeConfig.CLIENT_BASE_URL;

enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

interface RequestOptions {
  query?: any;
  body?: any;
}

const api = {
  baseUrl: `${SERVER_BASE_URL || CLIENT_BASE_URL}/api`,

  token: '',

  async makeRequest(
    method: HttpMethod,
    path: string,
    { query = {}, body }: RequestOptions = {}
  ) {
    if (api.token) query.access_token = api.token;

    const url = `${api.baseUrl}${path}?${stringify(query)}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // we can't parse json if there is no content
    let data = null;
    if (response.status !== 204) {
      data = await response.json();
    }

    if (!response.ok && !response.redirected) throw data;

    return data;
  },

  async get(path: string, options?: RequestOptions) {
    return api.makeRequest(HttpMethod.GET, path, options);
  },

  async post(path: string, options?: RequestOptions) {
    return api.makeRequest(HttpMethod.POST, path, options);
  },

  async patch(path: string, options?: RequestOptions) {
    return api.makeRequest(HttpMethod.PATCH, path, options);
  },

  async delete(path: string, options?: RequestOptions) {
    return api.makeRequest(HttpMethod.DELETE, path, options);
  }
};

export const configure = (token: string) => {
  api.token = token;
};

export const login = async (email: string, password: string) => {
  const body = { email, password };
  return api.post('/users/login', { body });
};

export const register = async (email: string, password: string) => {
  const body = { email, password };
  return api.post('/users/register', { body });
};

interface ChangePasswordBody {
  passwordOld: string;
  passwordNew: string;
}

export const changePassword = async (
  userId: string,
  body: ChangePasswordBody
) => {
  return api.post(`/users/${userId}/password`, { body });
};

// TODO: refactor
export const getCurrentUser = async () => {
  return api.get('/users/getByToken');
};

export interface PatchUserBody {
  firstName?: string;
  lastName?: string;
  country?: string;
  postalCode?: string;
  addres?: string;
}

export const patchUser = async (userId: string, body: PatchUserBody) => {
  return api.patch(`/users/${userId}`, { body });
};

export const getPage = async (slug: string) => {
  return api.get(`/pages/${slug}`);
};

export const getProduct = async (productId: string) => {
  return api.get(`/products/${productId}`);
};

export const getProductBySku = async (sku: string) => {
  const { data } = await api.get('/products', { query: { sku } });
  return data[0];
};

export const getRandomProducts = async (count = 4) => {
  const query = { count };
  return api.get('/products/random', { query });
};

export interface ProductFilters {
  category?: string;
  limit?: number;
  skip?: number;
  orderBy?: 'createdTime' | 'ordersCount' | 'name';
  order?: 'asc' | 'desc';
  tagsOptional: string | string[];
  tagsRequired: string | string[];
  inStock?: 'true' | 'false';
  sku?: string;
  search?: string;
}

export const getProducts = async (filters: ProductFilters) => {
  const query = filters;
  return api.get('/products', { query });
};

export const getTags = async (category: string) => {
  const query = { category };
  return api.get('/products/tags', { query });
};

export const getCart = async (cartId = '') => {
  return api.get(`/carts/${cartId}`);
};

export interface AddToCartBody {
  productId: string;
  qty: number;
  cartId?: string;
}

export const addToCart = async (
  productId: string,
  qty = 1,
  cartId?: string
) => {
  const body: AddToCartBody = { productId, qty };
  if (cartId) body.cartId = cartId;

  return api.post('/carts/add', { body });
};

export const addPromocode = async (cartId: string, promocode: string) => {
  const body = { promocode };
  return api.post(`/carts/${cartId}/promocode`, { body });
};

export const getOrders = async () => {
  return api.get('/orders');
};

export const getOrder = async (orderId: string) => {
  return api.get(`/orders/${orderId}`);
};

export const createOrder = async (cartId: string, comment: string) => {
  const body = { cartId, comment };
  return api.post('/orders', { body });
};

export const removeProductFromCart = async (cartId = '', productId: string) => {
  return api.delete(`/carts/${cartId}/${productId}`);
};

export interface CartBulkQtyUpdateItem {
  qty: number;
  product: string;
}

export const cartBulkQtyUpdate = async (
  cartId = '',
  items: CartBulkQtyUpdateItem[]
) => {
  const body = { items };
  return api.patch(`/carts/${cartId}`, { body });
};

export const payForOrder = async (orderId: string) => {
  return api.post(`/orders/${orderId}/pay`, { body: {} });
};
