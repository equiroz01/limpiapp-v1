import axios, { type AxiosInstance, type AxiosError, type AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = 30000; // 30 seconds

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const getTokens = (): AuthTokens | null => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  }
  return null;
};

const setTokens = (tokens: AuthTokens) => {
  localStorage.setItem('access_token', tokens.accessToken);
  localStorage.setItem('refresh_token', tokens.refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config) => {
        const tokens = getTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const tokens = getTokens();
            if (tokens?.refreshToken) {
              const response = await axios.post(`${API_URL}/auth/refresh`, {
                refreshToken: tokens.refreshToken,
              });

              const { accessToken, refreshToken } = response.data.data;
              setTokens({ accessToken, refreshToken });

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            clearTokens();
            window.location.href = '/login'; // Redirect to login on refresh failure
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic API methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const api = new ApiService();