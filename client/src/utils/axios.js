import axios from 'axios';
import SummaryApi, { baseURL } from '../config/summaryApi';

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken')

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)


Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem("refreshToken");

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken);
                
                if (newAccessToken) {
                    console.log("Using new access token:", newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return Axios(originalRequest); // Retry with new token
                }
            }
        }

        return Promise.reject(error);
    }
);


const refreshAccessToken = async (refreshToken) => {
    try {
        console.log("🔄 Refreshing Access Token...");
        
        const response = await Axios.post(SummaryApi.refreshToken.url, {}, { 
            headers: { Authorization: `Bearer ${refreshToken}` }
        });

        console.log("✅ Refresh API Response:", response.data);

        const accessToken = response.data.data?.accessToken;
        
        if (!accessToken) {
            console.error("❌ No access token received from refresh API");
            return null;
        }

        localStorage.setItem("accessToken", accessToken);
        return accessToken;

    } catch (error) {
        console.error("🔥 Refresh Token API Error:", error.response?.data || error.message);
        
        if (error.response?.status === 401) {  // ✅ Handle expired refresh token
            console.warn("❌ Refresh token expired, logging out...");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login"; // Redirect to login
        }

        return null;
    }
};




export default Axios