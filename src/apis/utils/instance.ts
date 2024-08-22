import axios from "axios";

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || "";

function axiosAPI(url: string, options?: any) {
    const instance = axios.create({ baseURL: url, ...options });
    interceptors(instance);
    return instance;
}

export const interceptors = (instance: any) => {
    instance.interceptors.request.use((config: any) => {
        const userUID = localStorage.getItem('userUID');
        console.log(userUID)
        config.headers.uid = userUID ? userUID : 'ohzysTvzabeSAnda1yVCShfPJaQ2';
        return config;
    }, (err: any) => Promise.reject(err.response));
}

const axiosAuthAPI = (url: string, options?: any) => {
    const instance = axios.create({ baseURL: url, ...options })
    return instance
}

export const defaultInstance = axiosAPI(BASE_URL);
export const authInstance = axiosAuthAPI(BASE_URL)