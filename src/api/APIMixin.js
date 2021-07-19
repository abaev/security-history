// Подстановочные методы отправки данных

const api = {
  methods: {
    apiSandData() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
    },

    apiChangePassword() {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
    }
  }
}

export default api;