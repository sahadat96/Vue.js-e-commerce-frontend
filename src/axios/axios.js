import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import router from "../route/route.js";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,  // Not needed for JWT
  withXSRFToken: false     // Not needed for JWT
});

axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


axiosClient.interceptors.response.use(
  response => {
    return response;
  }, 
  error => {
    // Handle authentication errors
    if (error?.response?.status === 401) {
      // Clear token from storage
      localStorage.removeItem('token');
      
      // Use auth store for additional cleanup if needed
      // const authStore = useAuthStore();
      // if (authStore && typeof authStore.handleTokenExpiration === 'function') {
      //   authStore.handleTokenExpiration();
      // }
      
      // // Redirect to login page
      // router.push({name: 'Login'});
    }
    
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('Network Error: Unable to connect to the server');
    }
    
    // Handle other server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server Error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;




// Response interceptor with enhanced error handling
// axios.interceptors.response.use(
//     response => response,
//     error => {
//         // Check if error response exists and status is 401
//         if (error?.response?.status === 401) {
//             const authStore = useAuthStore();
//             authStore.handleTokenExpiration();
//         }
        
//         // Handle network errors
//         if (!error.response) {
//             console.error('Network Error:', error);
//         }
        
//         return Promise.reject(error);
//     }
// );

// export default axios;



