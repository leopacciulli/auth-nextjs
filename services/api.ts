import axios, { AxiosError } from 'axios';
import { setCookie, parseCookies } from 'nookies';
import { signOut } from '../contexts/AuthContext';
import { AuthTokenError } from './errors/AuthTokenError';

let isRefreshing = false
let failedRequestQueue = []

export function setupApiClient(context = undefined) {
  let cookies = parseCookies(context);

  const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      Authorization: `Bearer ${cookies['authnextjs.token']}`
    }
  })
  
  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response?.data?.code === 'token.expired') {
        cookies = parseCookies(context)
  
        const { 'authnextjs.refreshToken': refreshToken } = cookies;
        const originalConfig = error.config;
  
        if (!isRefreshing) {
          isRefreshing = true;
  
          api.post('/refresh', {refreshToken}).then(response => {
            const { token } = response.data;
    
            setCookie(context, 'authnextjs.token', token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })
            
            setCookie(context, 'authnextjs.refreshToken', response.data.refreshToken, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: '/'
            })
    
            api.defaults.headers['Authorization'] = `Bearer ${token}`
  
            failedRequestQueue.forEach(request => request.onSuccess(token))
            failedRequestQueue = []
          }).catch(error => {
            failedRequestQueue.forEach(request => request.onFailed(error))
            failedRequestQueue = []
  
            if (process.browser) {
              signOut()
            }
          }).finally(() => {
            isRefreshing = false;
          })
        }
  
        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`
  
              resolve(api(originalConfig))
            },
            onFailed: (error: AxiosError) => {
              reject(error)
            } 
          })
        })
      } else {
        if (process.browser) {
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }
    }
  
    return Promise.reject(error)
  })

  return api
}