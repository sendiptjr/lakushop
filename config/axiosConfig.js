// axiosConfig.js
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { resetCart } from 'store/reducers/cart';
import { resetTransaction } from 'store/reducers/transaction';
import { resetUser, setUserLogged } from 'store/reducers/user';

const instance = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Token': 'lZng1bUM4OHk4UU1GRUV5NnppaTdzMlg4bpU15aRzRya0FuNjIyMTJzd2Rhc2Q6c2RhZGFzZDMydWkyam4xM3dlRURTRkVSI3NkZnNkZg==',
    'Api-Key': 'PcF4V5NnTdzMlaTJg4bzRya0FuIyMppNj',
    'X-Signature-Key': 'rN10l317q9Ax1w8v7qLaAEMI1IXtrMbng2Rw6fW9wpna5cflg',
  },
});

// Add an interceptor to include the Bearer token in the headers
instance.interceptors.request.use(
  (config) => {
    // Check if the user is logged in and has a token
    const token = localStorage.getItem('token'); // Adjust the storage method as per your application
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.request.use(
  (config) => {
    // Modify the request config here if needed
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Modify the response data here if needed
    return response;
  },
  (error) => {
    if(error?.response?.status === 401){
      localStorage.removeItem('token')
      useDispatch(setUserLogged(null));
      useDispatch(resetCart());
      useDispatch(resetTransaction());
      useDispatch(resetUser());
    }else{
      // alert(JSON.stringify(error?.response?.message))
    }

   
    // Handle response error globally
    // handleAxiosError(error);
    return Promise.reject(error);
  }
);

// Global error handler
const handleAxiosError = (error) => {
  // Handle the error here, you can log it, show a notification, etc.
  // console.error('Axios Error:', error);

  // Example: Redirect to an error page
  // router.push('/error');
};

export default instance;