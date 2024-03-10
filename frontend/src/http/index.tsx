import axios from "axios";
import { refreshToken } from "../services/auth.service";

const BASE_URL = `${process.env.REACT_APP_API_URL}/`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const TOKEN = "token";
export const REFRESH_TOKEN = "refresh_token";

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(TOKEN);
    const auth = token ? `Bearer ${token}` : "";
    if (auth) {
      config.headers.Authorization = auth;
    }
    return config;
  },
  (error) => Promise.reject(error.response.data)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response } = error;
    if (response) {
      const { data, status } = response;

      if (status === 419) {
        try {
          const refreshTokenStore = sessionStorage.getItem(REFRESH_TOKEN);
          if (!refreshTokenStore) return;
          const { access_token, refresh_token } = await refreshToken({
            refresh_token: refreshTokenStore,
          });
          sessionStorage.setItem(TOKEN, access_token);
          sessionStorage.setItem(REFRESH_TOKEN, refresh_token);
          if (error.config && error.config.headers) {
            error.config.headers.Authorization = `Bearer ${access_token}`;
            return axiosInstance(error.config);
          }
        } catch (error) {
          sessionStorage.removeItem(TOKEN);
          sessionStorage.removeItem(REFRESH_TOKEN);
        }
      }
      return Promise.reject({ status, data });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
