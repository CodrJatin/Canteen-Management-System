// Vite automatically prefix-loads variables starting with VITE_
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
    LOGIN: `${BASE_URL}/login`,
    REGISTER: `${BASE_URL}/register`,
    STOCK: `${BASE_URL}/stock`,
    ORDERS: `${BASE_URL}/orders`,
};

export default BASE_URL;