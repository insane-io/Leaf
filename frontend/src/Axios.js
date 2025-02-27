import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosInstance = axios.create({
  baseURL: 'http://192.168.0.107:8000/',
});

const CreateAxiosInstance = () => {
  const navigate = useNavigate(); 

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      // Set the content type to application/json
      config.headers['Content-Type'] = 'application/json'; // or 'application/x-www-form-urlencoded' depending on API needs
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default CreateAxiosInstance;
