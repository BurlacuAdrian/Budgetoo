import axios from 'axios';

const URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({

    baseURL: URL,
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
        if(window.location.pathname != '/login'){
          window.location.href = '/login'
        }
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;