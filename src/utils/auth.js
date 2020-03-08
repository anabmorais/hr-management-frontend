const STORAGE = window.localStorage;
const JWT_TOKEN_KEY = "jwtToken";

export const getToken = () => STORAGE.getItem(JWT_TOKEN_KEY);

export const setToken = jwt => STORAGE.setItem(JWT_TOKEN_KEY, jwt);

export const removeToken = () => STORAGE.removeItem(JWT_TOKEN_KEY);
