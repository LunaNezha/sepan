import axios from "axios";
import secureLocalStorage from "@services/secureStorage";
import { TOKEN } from "@constants/storageKeys";

const token = secureLocalStorage.getItem(TOKEN);

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    ...(typeof token === "string" && token ? {
      "Token-Key": token,
      Authorization: `Bearer ${token}`,
    } : {}),
  },
});

export default apiClient;
