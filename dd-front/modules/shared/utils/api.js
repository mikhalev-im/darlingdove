import fetch from 'isomorphic-unfetch';
import { stringify } from 'query-string';
import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const SERVER_BASE_URL = serverRuntimeConfig.SERVER_BASE_URL;
const CLIENT_BASE_URL = publicRuntimeConfig.CLIENT_BASE_URL;

class Api {
  getBaseUrl() {
    // server base url is available only on the server
    return SERVER_BASE_URL || CLIENT_BASE_URL;
  }

  async makeRequest(url, body, method) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
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
  }

  async get(url) {
    return this.makeRequest(url, null, 'GET');
  }

  async post(url, body) {
    return this.makeRequest(url, body, 'POST');
  }

  async patch(url, body) {
    return this.makeRequest(url, body, 'PATCH');
  }

  async delete(url, body) {
    return this.makeRequest(url, body, 'DELETE');
  }

  async login(email, password) {
    return this.post(`${this.getBaseUrl()}/users/login`, { email, password });
  }

  async register(email, password) {
    return this.post(`${this.getBaseUrl()}/users/register`, {
      email,
      password
    });
  }

  async changePassword(token, userId, data) {
    return this.post(
      `${this.getBaseUrl()}/users/${userId}/password?access_token=${token}`,
      data
    );
  }

  async getHomePage() {
    return this.get(`${this.getBaseUrl()}/pages/home`);
  }

  async getProduct(productId) {
    return this.get(`${this.getBaseUrl()}/products/${productId}`);
  }

  async getRandomProducts(count = 1) {
    return this.get(`${this.getBaseUrl()}/products/random?count=${count}`);
  }

  async getCurrentUser(token) {
    return this.get(
      `${this.getBaseUrl()}/users/getByToken?access_token=${token}`
    );
  }

  async getCart(cartId = '') {
    return this.get(`${this.getBaseUrl()}/carts/${cartId}`);
  }

  async addToCart(productId, qty = 1, cartId = null) {
    const body = { productId, qty };
    if (cartId) body.cartId = cartId;

    return this.post(`${this.getBaseUrl()}/carts/add`, body);
  }

  async createOrder(token, cartId) {
    const body = { cartId };
    return this.post(
      `${this.getBaseUrl()}/orders/createFromCart?access_token=${token}`,
      body
    );
  }

  async patchUser(token, userId, data) {
    return this.patch(
      `${this.getBaseUrl()}/users/${userId}?access_token=${token}`,
      data
    );
  }

  async getOrders(token) {
    return this.get(`${this.getBaseUrl()}/orders?access_token=${token}`);
  }

  async getOrder(token, orderId) {
    return this.get(
      `${this.getBaseUrl()}/orders/${orderId}?access_token=${token}`
    );
  }

  async getProducts(filters) {
    return this.get(`${this.getBaseUrl()}/products?${stringify(filters)}`);
  }

  async getTags(category) {
    let query = '';
    if (category) {
      query = stringify({ category });
    }

    return this.get(`${this.getBaseUrl()}/products/tags?${query}`);
  }

  async removeProductFromCart(cartId = '', productId) {
    return this.delete(`${this.getBaseUrl()}/carts/${cartId}/${productId}`);
  }

  async cartBulkQtyUpdate(cartId = '', items) {
    const body = { items };
    return this.patch(`${this.getBaseUrl()}/carts/${cartId}`, body);
  }

  async payForOrder(comment) {
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
  }
}

export default new Api();
