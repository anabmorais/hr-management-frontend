import axios from "axios";
import { getToken } from "./auth";

// Suggestion from https://github.com/axios/axios/issues/1383#issuecomment-401880630
export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    Authorization: {
      toString() {
        return `Bearer ${getToken()}`;
      }
    }
  }
});
