import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

export class HttpClient {
  client: AxiosInstance;
  private noInterceptorClient: AxiosInstance;

  constructor(protected baseURL?: string) {
    this.client = axios.create({
      baseURL: this.baseURL ?? "http://127.0.0.1:3000/", // Use 127.0.0.1 for localhost
    });

    this.noInterceptorClient = axios.create({
      baseURL: this.baseURL ?? "http://127.0.0.1:3000/",
    });

    // Add request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Log the full URL and request data before sending
        console.log(`Sending request to: ${config.baseURL}${config.url}`);
        console.log("Request data:", config.data);
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: any) => this.responseHandler(response),
      (error: any) => this.errorHandler(error)
    );
  }

  errorHandler(error: any) {
    console.error("Response error:", error); // Log errors from responses
    return Promise.reject(error);
  }

  responseHandler(response: any) {
    return Promise.resolve(response.data);
  }

  setHeaders(headers: { [key: string]: string }) {
    this.client.defaults.headers.common = headers;
  }

  setBaseURL(baseURL: string) {
    this.client.defaults.baseURL = baseURL;
  }

  setRequestInterceptor(callback: (config: AxiosRequestConfig) => any) {
    this.client.interceptors.request.use(callback);
  }

  clearRequestInterceptor() {
    this.client.interceptors.request.clear();
  }

  get<T = any>(endpoint: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(endpoint, config);
  }

  post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post<T>(endpoint, data, config);
  }

  put<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put<T>(endpoint, data, config);
  }

  patch<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.patch<T>(endpoint, data, config);
  }

  delete<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.delete<T>(endpoint, { data: data });
  }
}

let base_url = "http://10.0.2.2:3000";

export const httpClient = new HttpClient(base_url);
