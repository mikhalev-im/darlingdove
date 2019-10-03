import fetch from 'isomorphic-unfetch';
import { stringify } from 'query-string';
import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const SERVER_BASE_URL = serverRuntimeConfig.SERVER_BASE_URL;
const CLIENT_BASE_URL = publicRuntimeConfig.CLIENT_BASE_URL;

const api = {
  baseUrl: SERVER_BASE_URL || CLIENT_BASE_URL,

  token: null,

  async makeRequest(method, path, { query = {}, body } = {}) {
    if (api.token) query.access_token = api.token;

    const url = `${api.baseUrl}${path}?${stringify(query)}`;

    const options = {
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

  async get(path, options) {
    return api.makeRequest('GET', path, options);
  },

  async post(path, options) {
    return api.makeRequest('POST', path, options);
  },

  async patch(path, options) {
    return api.makeRequest('PATCH', path, options);
  },

  async delete(path, options) {
    return api.makeRequest('DELETE', path, options);
  }
};

export const configure = token => {
  api.token = token;
};

export const login = async (email, password) => {
  const body = { email, password };
  return api.post('/users/login', { body });
};

export const register = async (email, password) => {
  const body = { email, password };
  return api.post('/users/register', { body });
};

export const changePassword = async (userId, body) => {
  return api.post(`/users/${userId}/password`, { body });
};

// TODO: refactor
export const getCurrentUser = async () => {
  return api.get('/users/getByToken');
};

export const patchUser = async (userId, body) => {
  return api.patch(`/users/${userId}`, { body });
};

export const getHomePage = async () => {
  return api.get('/pages/home');
};

export const getProduct = async productId => {
  return api.get(`/products/${productId}`);
};

export const getProductBySku = async sku => {
  const { data } = await api.get('/products', { query: { sku } });
  return data[0];
};

export const getRandomProducts = async (count = 4) => {
  const query = { count };
  return api.get('/products/random', { query });
};

export const getProducts = async filters => {
  const query = filters;
  return api.get('/products', { query });
};

export const getTags = async category => {
  const query = { category };
  return api.get('/products/tags', { query });
};

export const getCart = async (cartId = '') => {
  return api.get(`/carts/${cartId}`);
};

export const addToCart = async (productId, qty = 1, cartId = null) => {
  const body = { productId, qty };
  if (cartId) body.cartId = cartId;

  return api.post('/carts/add', { body });
};

export const getOrders = async () => {
  return api.get('/orders');
};

export const getOrder = async orderId => {
  return api.get(`/orders/${orderId}`);
};

export const createOrder = async cartId => {
  const body = { cartId };
  return api.post('/orders/createFromCart', { body });
};

export const removeProductFromCart = async (cartId = '', productId) => {
  return api.delete(`/carts/${cartId}/${productId}`);
};

export const cartBulkQtyUpdate = async (cartId = '', items) => {
  const body = { items };
  return api.patch(`/carts/${cartId}`, { body });
};

export const payForOrder = async () => {
  const body = {
    receiver: 41001697476019,
    'quickpay-form': 'shop',
    targets: 'order #123',
    paymentType: 'PC',
    sum: 10
  };

  const options = {
    body: stringify(body),
    method: 'POST',
    mode: 'no-cors',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const response = await fetch(
    `https://money.yandex.ru/quickpay/confirm.xml`,
    options
  );

  // we can't parse json if there is no content
  let data = null;
  if (response.status !== 204) {
    data = await response.json();
  }

  if (!response.ok && !response.redirected) throw data;

  return data;
};
