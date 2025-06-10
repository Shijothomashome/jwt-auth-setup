import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    withCredentials: true
});

api.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response; // Continue the response if no error
    },
    async (error) => {
        try {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            const originalRequest = error.config;
            console.log('originalRequest', originalRequest)

            // Check for a 401 error and ensure this request hasn't been retried yet
            if (error.response && error.response.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
                originalRequest._retry = true;

                // Attempt to refresh the token
                const refreshResponse = await api.post('/auth/refresh');

                if (refreshResponse.data.success === 'true') {

                    // Retry the original request with the new token
                    return api(originalRequest);
                }
                else {
                    window.location.href = '/login';
                    toast.error('Session expired. Please log in again.');
                }
            }
            return Promise.reject(error);
        } catch (catchError) {
            // Handle any errors during the token refresh attempt
            window.location.href = '/login';
            console.error('Error during token refresh:', catchError.response?.data?.message || catchError.message);
            return Promise.reject(catchError);
        }
    }
);


export default api;