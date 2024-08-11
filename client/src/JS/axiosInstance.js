import axios from 'axios';

const axiosInstance = axios.create({

    baseURL: 'http://localhost:8020/v1',
    withCredentials: true,
    timeout: 5000
});

axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Redirect to login page if unauthorized
        window.location.href = '/login'
        // history.push('/login')
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;