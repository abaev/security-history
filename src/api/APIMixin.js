// Подстановочные методы отправки данных

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const url = 'https://example.com';

let mock = new MockAdapter(axios, { delayResponse: 2000 });
mock.onPost(`${url}/saveData`).reply(200, {});
mock.onPost(`${url}/changePassword`).reply(200, {});

const api = {
  methods: {
    apiSandData(data) {
      return axios.post(`${url}/saveData`, data);
    },

    apiChangePassword(data) {
      return axios.post(`${url}/changePassword`, data);
    }
  }
}

export default api;